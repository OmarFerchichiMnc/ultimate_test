import { channelTypeLabel, uniqueField, uniqueMapped } from "../../src/configuration/database";

export type AdvancedCombo = {
  label: string;
  paymentDate: unknown;
  channel: string;
  acquirer: string;
  country: string;
  fileId: string;
  fopCode: string;
  fopSub: string;
  settledStatus: string;
  paymentOrderReference: string;
  bankDepositReference: string;
  bankAccountNumber: string;
  bankedStatus: string;
};

function combo(overrides: Partial<AdvancedCombo> & { paymentDate: unknown; label: string }): AdvancedCombo {
  const value: AdvancedCombo = {
    channel: "",
    acquirer: "",
    country: "",
    fileId: "",
    fopCode: "",
    fopSub: "",
    settledStatus: "",
    paymentOrderReference: "",
    bankDepositReference: "",
    bankAccountNumber: "",
    bankedStatus: "",
    ...overrides,
  };
  if (!overrides.label) value.label = comboLabel(value);
  return value;
}

function withUnset(values: string[]): string[] {
  return ["", ...values];
}

function cartesian(lists: string[][]): string[][] {
  return lists.reduce<string[][]>((acc, list) => acc.flatMap((prefix) => list.map((item) => [...prefix, item])), [[]]);
}

function productsFor(fields: string[][], max = 128): string[][] {
  const build = (limit: number) =>
    cartesian(fields.map((values) => withUnset(values.slice(0, limit)))).filter((parts) => parts.some(Boolean));
  const withTwo = build(2);
  return withTwo.length <= max ? withTwo : build(1);
}

function comboLabel(value: Omit<AdvancedCombo, "label" | "paymentDate">): string {
  return [
    value.channel || value.acquirer,
    value.country,
    value.fileId,
    value.fopCode,
    value.fopSub,
    value.settledStatus,
    value.paymentOrderReference,
    value.bankDepositReference,
    value.bankAccountNumber,
    value.bankedStatus,
  ]
    .filter(Boolean)
    .join(" | ");
}

function labeled(value: AdvancedCombo): AdvancedCombo {
  value.label = comboLabel(value);
  return value;
}

function matchesSale(row: Record<string, unknown>, value: AdvancedCombo): boolean {
  if (value.channel && channelTypeLabel(row) !== value.channel) return false;
  if (value.country && String(row.country ?? "") !== value.country) return false;
  if (value.fileId && String(row.operation_id ?? "") !== value.fileId) return false;
  if (value.fopCode && String(row.form_of_payment_code ?? "") !== value.fopCode) return false;
  if (value.fopSub && String(row.fop_sub_code ?? "") !== value.fopSub) return false;
  if (value.settledStatus && String(row.settled_status ?? "") !== value.settledStatus) return false;
  return true;
}

function matchesSettlement(row: Record<string, unknown>, value: AdvancedCombo): boolean {
  if (value.acquirer && String(row.acquirer ?? "") !== value.acquirer) return false;
  if (value.country && String(row.country ?? "") !== value.country) return false;
  if (value.fileId && String(row.operation_id ?? "") !== value.fileId) return false;
  if (value.fopCode && String(row.form_of_payment_code ?? "") !== value.fopCode) return false;
  if (value.fopSub && String(row.fop_sub_code ?? "") !== value.fopSub) return false;
  if (value.settledStatus && String(row.settled_status ?? "") !== value.settledStatus) return false;
  if (value.paymentOrderReference && String(row.payment_order_reference ?? "") !== value.paymentOrderReference) {
    return false;
  }
  return true;
}

function matchesPaymentOrder(row: Record<string, unknown>, value: AdvancedCombo): boolean {
  if (value.acquirer && String(row.acquirer ?? "") !== value.acquirer) return false;
  if (value.paymentOrderReference && String(row.payment_order_reference ?? "") !== value.paymentOrderReference) {
    return false;
  }
  if (value.bankDepositReference && String(row.bank_deposit_reference ?? "") !== value.bankDepositReference) {
    return false;
  }
  if (value.fileId && String(row.operation_id ?? "") !== value.fileId) return false;
  if (value.bankedStatus && String(row.banked_status ?? "") !== value.bankedStatus) return false;
  return true;
}

function matchesBankDeposit(row: Record<string, unknown>, value: AdvancedCombo): boolean {
  if (value.acquirer && String(row.acquirer ?? "") !== value.acquirer) return false;
  if (value.bankDepositReference && String(row.bank_deposit_reference ?? "") !== value.bankDepositReference) {
    return false;
  }
  if (value.bankAccountNumber && String(row.bank_account_number ?? "") !== value.bankAccountNumber) return false;
  if (value.fileId && String(row.operation_id ?? "") !== value.fileId) return false;
  if (value.bankedStatus && String(row.banked_status ?? "") !== value.bankedStatus) return false;
  return true;
}

function classify(
  rows: Record<string, unknown>[],
  products: string[][],
  toCombo: (parts: string[], paymentDate: unknown) => AdvancedCombo,
  matches: (row: Record<string, unknown>, value: AdvancedCombo) => boolean,
): { positives: AdvancedCombo[]; negatives: AdvancedCombo[] } {
  const positives: AdvancedCombo[] = [];
  const negatives: AdvancedCombo[] = [];
  const fallbackDate = rows[0]?.payment_date;
  for (const parts of products) {
    const value = toCombo(parts, fallbackDate);
    const row = rows.find((candidate) => matches(candidate, value));
    if (row) {
      value.paymentDate = row.payment_date;
      positives.push(value);
    } else {
      negatives.push(value);
    }
  }
  return { positives, negatives };
}

export function saleAdvancedCombos(rows: Record<string, unknown>[]): {
  positives: AdvancedCombo[];
  negatives: AdvancedCombo[];
} {
  const products = productsFor([
    uniqueMapped(rows, channelTypeLabel, 2),
    uniqueField(rows, "country", 2),
    uniqueField(rows, "operation_id", 2),
    uniqueField(rows, "form_of_payment_code", 2),
    uniqueField(rows, "fop_sub_code", 2),
    uniqueField(rows, "settled_status", 2),
  ]);
  const classified = classify(
    rows,
    products,
    (parts, paymentDate) =>
      labeled(
        combo({
          paymentDate,
          label: "",
          channel: parts[0],
          country: parts[1],
          fileId: parts[2],
          fopCode: parts[3],
          fopSub: parts[4],
          settledStatus: parts[5],
        }),
      ),
    matchesSale,
  );
  classified.negatives.push(
    ...syntheticSaleNegatives(rows, classified.positives[0]?.paymentDate ?? rows[0]?.payment_date),
  );
  return classified;
}

export function settlementAdvancedCombos(rows: Record<string, unknown>[]): {
  positives: AdvancedCombo[];
  negatives: AdvancedCombo[];
} {
  const products = productsFor([
    uniqueField(rows, "acquirer", 2),
    uniqueField(rows, "country", 2),
    uniqueField(rows, "operation_id", 2),
    uniqueField(rows, "form_of_payment_code", 2),
    uniqueField(rows, "fop_sub_code", 2),
    uniqueField(rows, "settled_status", 2),
    uniqueField(rows, "payment_order_reference", 2),
  ]);
  const classified = classify(
    rows,
    products,
    (parts, paymentDate) =>
      labeled(
        combo({
          paymentDate,
          label: "",
          acquirer: parts[0],
          country: parts[1],
          fileId: parts[2],
          fopCode: parts[3],
          fopSub: parts[4],
          settledStatus: parts[5],
          paymentOrderReference: parts[6] ?? "",
        }),
      ),
    matchesSettlement,
  );
  classified.negatives.push(
    ...syntheticSettlementNegatives(rows, classified.positives[0]?.paymentDate ?? rows[0]?.payment_date),
  );
  return classified;
}

export function paymentOrderAdvancedCombos(rows: Record<string, unknown>[]): {
  positives: AdvancedCombo[];
  negatives: AdvancedCombo[];
} {
  const products = productsFor([
    uniqueField(rows, "acquirer", 2),
    uniqueField(rows, "payment_order_reference", 2),
    uniqueField(rows, "bank_deposit_reference", 2),
    uniqueField(rows, "operation_id", 2),
    uniqueField(rows, "banked_status", 2),
  ]);
  const classified = classify(
    rows,
    products,
    (parts, paymentDate) =>
      labeled(
        combo({
          paymentDate,
          label: "",
          acquirer: parts[0],
          paymentOrderReference: parts[1],
          bankDepositReference: parts[2],
          fileId: parts[3],
          bankedStatus: parts[4],
        }),
      ),
    matchesPaymentOrder,
  );
  classified.negatives.push(
    ...syntheticPaymentOrderNegatives(rows, classified.positives[0]?.paymentDate ?? rows[0]?.payment_date),
  );
  return classified;
}

export function bankDepositAdvancedCombos(rows: Record<string, unknown>[]): {
  positives: AdvancedCombo[];
  negatives: AdvancedCombo[];
} {
  const products = productsFor([
    uniqueField(rows, "acquirer", 2),
    uniqueField(rows, "bank_deposit_reference", 2),
    uniqueField(rows, "bank_account_number", 2),
    uniqueField(rows, "banked_status", 2),
  ]);
  const classified = classify(
    rows,
    products,
    (parts, paymentDate) =>
      labeled(
        combo({
          paymentDate,
          label: "",
          acquirer: parts[0],
          bankDepositReference: parts[1],
          bankAccountNumber: parts[2],
          bankedStatus: parts[3],
        }),
      ),
    matchesBankDeposit,
  );
  classified.negatives.push(
    ...syntheticBankDepositNegatives(rows, classified.positives[0]?.paymentDate ?? rows[0]?.payment_date),
  );
  return classified;
}

function syntheticSaleNegatives(rows: Record<string, unknown>[], paymentDate: unknown): AdvancedCombo[] {
  const realChannel = uniqueMapped(rows, channelTypeLabel, 1)[0] ?? "";
  const realCountry = uniqueField(rows, "country", 1)[0] ?? "";
  const realFile = uniqueField(rows, "operation_id", 1)[0] ?? "";
  const realFop = uniqueField(rows, "form_of_payment_code", 1)[0] ?? "";
  return [
    combo({ paymentDate, label: "wrong channel", channel: "DIRECT - DirectSale", country: realCountry, fileId: realFile, fopCode: realFop }),
    combo({ paymentDate, label: "wrong country", channel: realChannel, country: "ZZ", fileId: realFile, fopCode: realFop }),
    combo({ paymentDate, label: "wrong file id", channel: realChannel, country: realCountry, fileId: "does-not-exist", fopCode: realFop }),
    combo({ paymentDate, label: "wrong fop code", channel: realChannel, country: realCountry, fileId: realFile, fopCode: "XX99" }),
  ].filter((value) => !rows.some((row) => matchesSale(row, value)));
}

function syntheticSettlementNegatives(rows: Record<string, unknown>[], paymentDate: unknown): AdvancedCombo[] {
  const realAcquirer = uniqueField(rows, "acquirer", 1)[0] ?? "";
  const realCountry = uniqueField(rows, "country", 1)[0] ?? "";
  const realFile = uniqueField(rows, "operation_id", 1)[0] ?? "";
  const realFop = uniqueField(rows, "form_of_payment_code", 1)[0] ?? "";
  return [
    combo({ paymentDate, label: "wrong acquirer", acquirer: "UNKNOWN_ACQUIRER", country: realCountry, fileId: realFile, fopCode: realFop }),
    combo({ paymentDate, label: "wrong country", acquirer: realAcquirer, country: "ZZ", fileId: realFile, fopCode: realFop }),
    combo({ paymentDate, label: "wrong file id", acquirer: realAcquirer, country: realCountry, fileId: "does-not-exist", fopCode: realFop }),
  ].filter((value) => !rows.some((row) => matchesSettlement(row, value)));
}

function syntheticPaymentOrderNegatives(rows: Record<string, unknown>[], paymentDate: unknown): AdvancedCombo[] {
  const realAcquirer = uniqueField(rows, "acquirer", 1)[0] ?? "";
  const realReference = uniqueField(rows, "payment_order_reference", 1)[0] ?? "";
  const realDeposit = uniqueField(rows, "bank_deposit_reference", 1)[0] ?? "";
  const realFile = uniqueField(rows, "operation_id", 1)[0] ?? "";
  return [
    combo({ paymentDate, label: "wrong acquirer", acquirer: "UNKNOWN_ACQUIRER", paymentOrderReference: realReference, bankDepositReference: realDeposit, fileId: realFile }),
    combo({ paymentDate, label: "wrong payment order reference", acquirer: realAcquirer, paymentOrderReference: "does-not-exist", bankDepositReference: realDeposit, fileId: realFile }),
    combo({ paymentDate, label: "wrong bank deposit reference", acquirer: realAcquirer, paymentOrderReference: realReference, bankDepositReference: "does-not-exist", fileId: realFile }),
    combo({ paymentDate, label: "wrong file id", acquirer: realAcquirer, paymentOrderReference: realReference, bankDepositReference: realDeposit, fileId: "does-not-exist" }),
    combo({ paymentDate, label: "wrong banked status", acquirer: realAcquirer, paymentOrderReference: realReference, bankDepositReference: realDeposit, fileId: realFile, bankedStatus: "Deposited" }),
  ].filter((value) => !rows.some((row) => matchesPaymentOrder(row, value)));
}

function syntheticBankDepositNegatives(rows: Record<string, unknown>[], paymentDate: unknown): AdvancedCombo[] {
  const realAcquirer = uniqueField(rows, "acquirer", 1)[0] ?? "";
  const realDeposit = uniqueField(rows, "bank_deposit_reference", 1)[0] ?? "";
  const realAccount = uniqueField(rows, "bank_account_number", 1)[0] ?? "";
  const realFile = uniqueField(rows, "operation_id", 1)[0] ?? "";
  return [
    combo({ paymentDate, label: "wrong acquirer", acquirer: "UNKNOWN_ACQUIRER", bankDepositReference: realDeposit, bankAccountNumber: realAccount, fileId: realFile }),
    combo({ paymentDate, label: "wrong bank deposit reference", acquirer: realAcquirer, bankDepositReference: "does-not-exist", bankAccountNumber: realAccount, fileId: realFile }),
    combo({ paymentDate, label: "wrong bank account number", acquirer: realAcquirer, bankDepositReference: realDeposit, bankAccountNumber: "does-not-exist", fileId: realFile }),
    combo({ paymentDate, label: "wrong file id", acquirer: realAcquirer, bankDepositReference: realDeposit, bankAccountNumber: realAccount, fileId: "does-not-exist" }),
    combo({ paymentDate, label: "wrong banked status", acquirer: realAcquirer, bankDepositReference: realDeposit, bankAccountNumber: realAccount, fileId: realFile, bankedStatus: "Deposited" }),
  ].filter((value) => !rows.some((row) => matchesBankDeposit(row, value)));
}
