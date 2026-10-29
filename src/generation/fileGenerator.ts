/**
 * TypeScript port of adad-scripts/files-generator (Java). Builds Sale / Settlement /
 * BankDeposit CSV files with fresh, unique keys for every test run, so scenarios never
 * collide with data left behind by a previous run and the expected values (document
 * number, counts, date range...) always match what was actually uploaded.
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { config } from "../configuration/config";

export type MatchingStrategy =
  /** Same document number + FOP code on both sides (default ADAD rule). */
  | "documentNumberAndFop"
  /** Different document number / PNR, same card BIN + last 4 + approval code. */
  | "cardAndApprovalCode"
  /** Different document number and card, same PNR reference. */
  | "pnrReference"
  /** Groups of sales sharing card BIN + last 4 + approval code (N:N molecules). */
  | "manyToMany"
  /** Every sale is settled by two settlements carrying half the amount each. */
  | "oneToMany"
  /** Two sales (half amount each, same document) settled by a single settlement. */
  | "manyToOne";

export type DataVariant =
  | "valid"
  /** First settlement is 5% lower than its sale. */
  | "amountDiscrepancy"
  /** First sale row is repeated. */
  | "duplicateTransaction"
  /** First sale row has a non numeric amount. */
  | "corruptedRecord"
  /** First sale row uses a FOP code that is not configured. */
  | "unknownFop"
  /** First sale row uses an office id that is not configured. */
  | "unknownOffice"
  /** First settlement row has no merchant id. */
  | "missingMerchant"
  /** First sale row uses a currency without a rate of exchange. */
  | "missingRoe"
  /** Sale file header misses a mandatory column. */
  | "corruptedStructure";

export type GenerationOptions = {
  scenarioId: string;
  strategy?: MatchingStrategy;
  variant?: DataVariant;
  /** Sale vs refund pairs in the sale file (secondary matching). */
  withRefunds?: boolean;
  multiCurrency?: boolean;
  transactionCount?: number;
  /** yyyy-mm-dd, "today" (UTC) or undefined for the configured default. */
  paymentDate?: string;
};

export type BaseTransaction = {
  documentNumber: string;
  pnrReference: string;
  ccBin: string;
  ccFourLastDigits: string;
  approvalCode: string;
  fopCode: string;
  fopSubCode: string;
  currency: string;
  amount: string;
  paymentDate: string;
  alternateOfficeId: string;
  pspMid: string;
  psp: string;
};

export type GeneratedFile = {
  kind: "sale" | "settlement" | "bankDeposit";
  fileName: string;
  filePath: string;
  /** Data rows, header excluded. */
  count: number;
  /**
   * Rows ADAD should flag as eligible on the File Dashboard. Only known for valid
   * data; undefined when a variant deliberately breaks rows.
   */
  eligible?: number;
  csv: string;
};

export type ScenarioDataset = {
  scenarioId: string;
  strategy: MatchingStrategy;
  variant: DataVariant;
  /** Directory holding the generated files (used as local upload path). */
  dir: string;
  sale: GeneratedFile;
  settlement: GeneratedFile;
  bankDeposit: GeneratedFile;
  sales: BaseTransaction[];
  settlements: BaseTransaction[];
  /** Values of the first sale, handy for UI filters / assertions. */
  documentNumber: string;
  pnrReference: string;
  ccBin: string;
  ccFourLastDigits: string;
  approvalCode: string;
  fopCode: string;
  fopSubCode: string;
  currency: string;
  /** yyyy-mm-dd */
  paymentDate: string;
  /** dd/mm/yyyy */
  paymentDateUi: string;
  /** ISO timestamp at midnight UTC of the payment date. */
  paymentDateIso: string;
  /** "dd/mm/yyyy - dd/mm/yyyy" covering the whole payment month. */
  paymentDateRange: string;
};

// ---------------------------------------------------------------------------
// Static reference data (mirrors the Java generator outputs)
// ---------------------------------------------------------------------------

export const SALE_HEADERS = [
  "agentCode", "pnrReference", "passengerName", "passengerType", "documentNumber", "documentType",
  "transactionCode", "transactionType", "reasonForIssuanceCode", "paymentDate", "alternateFormOfPaymentCode",
  "approvalCode", "invoiceNumber", "grossAmountInPaymentCurrency", "paymentCurrency", "ccNumber", "ccBin",
  "ccFourLastDigits", "airline", "company", "orderId", "paymentId", "customerProfileId", "saleChannelType",
  "officeId", "additionalReferenceKey1", "additionalReferenceKey2", "additionalReferenceKey3", "serviceType",
  "totalInstallmentCount", "city", "country", "periodFrom", "periodTo", "reportingSystemIdentifier",
  "grossAmountInSaleCurrency", "saleCurrency", "originalFirstIssuanceDate", "fopSubCode", "alternateOfficeId",
  "pspMid", "psp",
] as const;

export const SETTLEMENT_HEADERS = [
  "pnrReference", "documentNumber", "documentType", "transactionCode", "transactionType", "settlementDate",
  "paymentDate", "alternateFormOfPaymentCode", "serviceFeeRate", "ccNumber", "ccBin", "ccFourLastDigits",
  "approvalCode", "merchantId", "providerName", "providerReceptionDate", "airline", "orderId", "mcpFxRate",
  "paymentId", "arn", "customerProfileId", "issuanceBank", "additionalReferenceKey1", "additionalReferenceKey2",
  "additionalReferenceKey3", "isInstallment", "installmentCount", "installmentNumber", "paymentCurrency",
  "settlementCurrency", "firstInstallmentAmountInPaymentCurrency", "firstInstallmentAmountInSettlementCurrency",
  "grossAmountInPaymentCurrency", "grossAmountInSettlementCurrency", "netAmountInPaymentCurrency",
  "netAmountInSettlementCurrency", "discountRateAmountInPaymentCurrency", "discountRateAmountInSettlementCurrency",
  "interchangeFeeAmountInPaymentCurrency", "interchangeFeeAmountInSettlementCurrency",
  "acquirerMarkupAmountInPaymentCurrency", "acquirerMarkupAmountInSettlementCurrency",
  "cardSchemeFeeAmountInPaymentCurrency", "cardSchemeFeeAmountInSettlementCurrency",
  "totalInstallementAmountInPaymentCurrency", "totalInstallementAmountInSettlementCurrency", "confirmationStatus",
  "provisionalConfirmedAssociationKey", "originalFirstIssuanceDate", "fopSubCode", "paymentOrderReference",
  "balanceTransferReference",
] as const;

export const BANK_DEPOSIT_HEADERS = [
  "recordId", "airline", "bankIdentifierCode", "acquirerName", "bankAccountNumber", "amountInDepositCurrency",
  "depositCurrency", "depositDate", "description", "bankDepositReference",
] as const;

const MULTI_CURRENCIES = ["EUR", "USD", "GBP"];
const FOP_CODES: Array<[string, string]> = [
  ["CCVI", "EXTASO"],
  ["CCCA", "EXTAAX"],
  ["CCAX", "EXTAAL"],
];

// ---------------------------------------------------------------------------
// Random helpers (crypto based, no extra dependency)
// ---------------------------------------------------------------------------

function randomInt(min: number, max: number): number {
  return crypto.randomInt(min, max + 1);
}

function digits(length: number, noLeadingZero = true): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += String(i === 0 && noLeadingZero ? randomInt(1, 9) : randomInt(0, 9));
  }
  return out;
}

function letter(): string {
  return String.fromCharCode(65 + randomInt(0, 25));
}

function money(min = 100, max = 1000): string {
  return (randomInt(min * 100, max * 100) / 100).toFixed(2);
}

function half(amount: string): [string, string] {
  const cents = Math.round(Number(amount) * 100);
  const first = Math.floor(cents / 2);
  return [(first / 100).toFixed(2), ((cents - first) / 100).toFixed(2)];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export type GenerationSettings = {
  outputDir: string;
  fileSuffix: string;
  transactionCount: number;
  paymentDate: string;
  awbPrefixCode: string;
  airline: string;
  accountingCurrency: string;
  officeId: string;
  merchantId: string;
  saleDatasource: string;
  settlementDatasource: string;
  bankDepositDatasource: string;
  fileReceptionConfiguration: string;
};

export function generationSettings(): GenerationSettings {
  return config.generation;
}

export function resolvePaymentDate(value: string | undefined, fallback = generationSettings().paymentDate): string {
  const raw = (value ?? fallback ?? "today").trim();
  if (!raw || raw.toLowerCase() === "today") {
    return new Date().toISOString().slice(0, 10);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new Error(`Payment date must be yyyy-mm-dd or "today", got '${raw}'`);
  }
  return raw;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toUi(isoDay: string): string {
  const [y, m, d] = isoDay.split("-");
  return `${d}/${m}/${y}`;
}

function monthRangeUi(isoDay: string): string {
  const [y, m] = isoDay.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `01/${pad(m)}/${y} - ${pad(last)}/${pad(m)}/${y}`;
}

// ---------------------------------------------------------------------------
// Base transactions (BaseTransactionBuilder port)
// ---------------------------------------------------------------------------

const usedPnrs = new Set<string>();
const usedDocuments = new Set<string>();

function uniquePnr(): string {
  let pnr: string;
  do {
    pnr = `${letter()}${randomInt(0, 9)}${letter()}${randomInt(0, 9)}${letter()}${randomInt(0, 9)}`;
  } while (usedPnrs.has(pnr));
  usedPnrs.add(pnr);
  return pnr;
}

function uniqueDocument(awbPrefixCode: string): string {
  let doc: string;
  do {
    doc = `${awbPrefixCode}${digits(10, false)}`;
  } while (usedDocuments.has(doc));
  usedDocuments.add(doc);
  return doc;
}

export function createBaseTransaction(
  settings: GenerationSettings,
  paymentDate: string,
  currency: string,
): BaseTransaction {
  const [fopCode, fopSubCode] = FOP_CODES[0];
  return {
    documentNumber: uniqueDocument(settings.awbPrefixCode),
    pnrReference: uniquePnr(),
    ccBin: digits(6),
    ccFourLastDigits: digits(4),
    approvalCode: digits(6),
    fopCode,
    fopSubCode,
    currency,
    amount: money(),
    paymentDate,
    alternateOfficeId: digits(6),
    pspMid: digits(6),
    psp: digits(6),
  };
}

function cloneWith(base: BaseTransaction, patch: Partial<BaseTransaction>): BaseTransaction {
  return { ...base, ...patch };
}

// ---------------------------------------------------------------------------
// Matching strategies (TestScenario.java port)
// ---------------------------------------------------------------------------

function buildPairs(
  strategy: MatchingStrategy,
  count: number,
  settings: GenerationSettings,
  paymentDate: string,
  currencyFor: (index: number) => string,
): { sales: BaseTransaction[]; settlements: BaseTransaction[] } {
  const fresh = (i: number) => createBaseTransaction(settings, paymentDate, currencyFor(i));
  const sales: BaseTransaction[] = [];
  const settlements: BaseTransaction[] = [];

  switch (strategy) {
    case "documentNumberAndFop": {
      for (let i = 0; i < count; i += 1) {
        const sale = fresh(i);
        sales.push(sale);
        settlements.push(cloneWith(sale, {}));
      }
      break;
    }
    case "cardAndApprovalCode": {
      for (let i = 0; i < count; i += 1) {
        const sale = fresh(i);
        sales.push(sale);
        settlements.push(
          cloneWith(sale, { documentNumber: uniqueDocument(settings.awbPrefixCode), pnrReference: uniquePnr() }),
        );
      }
      break;
    }
    case "pnrReference": {
      for (let i = 0; i < count; i += 1) {
        const sale = fresh(i);
        sales.push(sale);
        settlements.push(
          cloneWith(sale, {
            documentNumber: uniqueDocument(settings.awbPrefixCode),
            ccBin: digits(6),
            ccFourLastDigits: digits(4),
            approvalCode: digits(6),
          }),
        );
      }
      break;
    }
    case "manyToMany": {
      const atomsPerMolecule = Math.min(5, Math.max(2, count));
      const groups = Math.max(1, Math.floor(count / atomsPerMolecule));
      for (let g = 0; g < groups; g += 1) {
        const leader = fresh(g);
        for (let a = 0; a < atomsPerMolecule; a += 1) {
          const sale =
            a === 0
              ? leader
              : cloneWith(fresh(g), {
                  currency: leader.currency,
                  ccBin: leader.ccBin,
                  ccFourLastDigits: leader.ccFourLastDigits,
                  approvalCode: leader.approvalCode,
                });
          sales.push(sale);
          settlements.push(
            cloneWith(sale, { documentNumber: uniqueDocument(settings.awbPrefixCode), pnrReference: uniquePnr() }),
          );
        }
      }
      break;
    }
    case "oneToMany": {
      for (let i = 0; i < count; i += 1) {
        const sale = fresh(i);
        sales.push(sale);
        const [a, b] = half(sale.amount);
        settlements.push(cloneWith(sale, { amount: a }), cloneWith(sale, { amount: b }));
      }
      break;
    }
    case "manyToOne": {
      for (let i = 0; i < count; i += 1) {
        const settlement = fresh(i);
        settlements.push(settlement);
        const [a, b] = half(settlement.amount);
        sales.push(cloneWith(settlement, { amount: a }), cloneWith(settlement, { amount: b }));
      }
      break;
    }
    default: {
      const never: never = strategy;
      throw new Error(`Unknown matching strategy ${String(never)}`);
    }
  }
  return { sales, settlements };
}

// ---------------------------------------------------------------------------
// Row builders (SaleFileBuilder / SettlementFileBuilder / BankDepositFileBuilder)
// ---------------------------------------------------------------------------

export function saleRow(t: BaseTransaction, settings: GenerationSettings, transactionType = "SALE"): Record<string, string> {
  return {
    agentCode: settings.officeId,
    pnrReference: t.pnrReference,
    passengerName: "chakib",
    passengerType: "ADT",
    documentNumber: t.documentNumber,
    documentType: "Ticket",
    transactionCode: "TKTT",
    transactionType,
    reasonForIssuanceCode: "",
    paymentDate: t.paymentDate,
    alternateFormOfPaymentCode: t.fopCode,
    approvalCode: t.approvalCode,
    invoiceNumber: "AX232220609938",
    grossAmountInPaymentCurrency: t.amount,
    paymentCurrency: t.currency,
    ccNumber: `${t.ccBin}XXXXX${t.ccFourLastDigits}`,
    ccBin: t.ccBin,
    ccFourLastDigits: t.ccFourLastDigits,
    airline: "",
    company: "",
    orderId: "",
    paymentId: "",
    customerProfileId: "",
    saleChannelType: "INDIRECT",
    officeId: settings.officeId,
    additionalReferenceKey1: "",
    additionalReferenceKey2: "",
    additionalReferenceKey3: "",
    serviceType: "PASSENGER",
    totalInstallmentCount: "",
    city: "TUN",
    country: "TU",
    periodFrom: "2023-05-13",
    periodTo: "2024-05-13",
    reportingSystemIdentifier: "",
    grossAmountInSaleCurrency: t.amount,
    saleCurrency: t.currency,
    originalFirstIssuanceDate: "",
    fopSubCode: t.fopSubCode,
    alternateOfficeId: t.alternateOfficeId,
    pspMid: t.pspMid,
    psp: t.psp,
  };
}

export function settlementRow(t: BaseTransaction, settings: GenerationSettings): Record<string, string> {
  return {
    pnrReference: t.pnrReference,
    documentNumber: t.documentNumber,
    documentType: "Ticket",
    transactionCode: "TKTT",
    transactionType: "SETTLEMENT",
    settlementDate: t.paymentDate,
    paymentDate: t.paymentDate,
    alternateFormOfPaymentCode: t.fopCode,
    serviceFeeRate: "",
    ccNumber: `${t.ccBin}XXXXX${t.ccFourLastDigits}`,
    ccBin: t.ccBin,
    ccFourLastDigits: t.ccFourLastDigits,
    approvalCode: t.approvalCode,
    merchantId: settings.merchantId,
    providerName: "",
    providerReceptionDate: t.paymentDate,
    airline: settings.airline,
    orderId: "",
    mcpFxRate: "1",
    paymentId: "",
    arn: "",
    customerProfileId: "",
    issuanceBank: "",
    additionalReferenceKey1: "",
    additionalReferenceKey2: "",
    additionalReferenceKey3: "",
    isInstallment: "NO",
    installmentCount: "",
    installmentNumber: "",
    paymentCurrency: t.currency,
    settlementCurrency: t.currency,
    firstInstallmentAmountInPaymentCurrency: "",
    firstInstallmentAmountInSettlementCurrency: "",
    grossAmountInPaymentCurrency: t.amount,
    grossAmountInSettlementCurrency: t.amount,
    netAmountInPaymentCurrency: t.amount,
    netAmountInSettlementCurrency: t.amount,
    discountRateAmountInPaymentCurrency: "0",
    discountRateAmountInSettlementCurrency: "0",
    interchangeFeeAmountInPaymentCurrency: "",
    interchangeFeeAmountInSettlementCurrency: "",
    acquirerMarkupAmountInPaymentCurrency: "",
    acquirerMarkupAmountInSettlementCurrency: "",
    cardSchemeFeeAmountInPaymentCurrency: "",
    cardSchemeFeeAmountInSettlementCurrency: "",
    totalInstallementAmountInPaymentCurrency: "",
    totalInstallementAmountInSettlementCurrency: "",
    confirmationStatus: "NOT_APPLICABLE",
    provisionalConfirmedAssociationKey: "",
    originalFirstIssuanceDate: "",
    fopSubCode: t.fopSubCode,
    paymentOrderReference: "",
    balanceTransferReference: "",
  };
}

/** One deposit per currency + payment date, summing the settlements (default grouping). */
export function bankDepositRows(settlements: BaseTransaction[], settings: GenerationSettings): Record<string, string>[] {
  const groups = new Map<string, { currency: string; date: string; cents: number }>();
  for (const s of settlements) {
    const key = `${s.currency}|${s.paymentDate}`;
    const current = groups.get(key) ?? { currency: s.currency, date: s.paymentDate, cents: 0 };
    current.cents += Math.round(Number(s.amount) * 100);
    groups.set(key, current);
  }
  return [...groups.values()].map((g) => ({
    recordId: Array.from({ length: 14 }, () => letter().toLowerCase()).join(""),
    airline: settings.airline,
    bankIdentifierCode: `${letter()}${letter()}${letter()}${letter()}FI${digits(2)}`,
    acquirerName: settings.settlementDatasource,
    bankAccountNumber: `FI${digits(16, false)}`,
    amountInDepositCurrency: (g.cents / 100).toFixed(2),
    depositCurrency: g.currency,
    depositDate: g.date,
    description: "Generated by ultimate-test",
    bankDepositReference: `TX-${digits(6)}`,
  }));
}

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(headers: readonly string[], rows: Record<string, string>[]): string {
  return [headers.join(","), ...rows.map((row) => headers.map((h) => csvCell(row[h] ?? "")).join(","))].join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Variants (negative data for ingestion scenarios)
// ---------------------------------------------------------------------------

function applySaleVariant(rows: Record<string, string>[], variant: DataVariant): Record<string, string>[] {
  if (!rows.length) return rows;
  const out = rows.map((r) => ({ ...r }));
  switch (variant) {
    case "duplicateTransaction":
      out.splice(1, 0, { ...out[0] });
      break;
    case "corruptedRecord":
      out[0].grossAmountInPaymentCurrency = "NOT_A_NUMBER";
      out[0].paymentDate = "2026-13-45";
      break;
    case "unknownFop":
      out[0].alternateFormOfPaymentCode = "ZZZZ";
      break;
    case "unknownOffice":
      out[0].officeId = "99999999";
      out[0].agentCode = "99999999";
      break;
    case "missingRoe":
      out[0].paymentCurrency = "XAF";
      out[0].saleCurrency = "XAF";
      break;
    default:
      break;
  }
  return out;
}

function applySettlementVariant(
  settlements: BaseTransaction[],
  rows: Record<string, string>[],
  variant: DataVariant,
): Record<string, string>[] {
  if (!rows.length) return rows;
  const out = rows.map((r) => ({ ...r }));
  if (variant === "amountDiscrepancy") {
    const reduced = (Number(settlements[0].amount) * 0.95).toFixed(2);
    for (const key of [
      "grossAmountInPaymentCurrency",
      "grossAmountInSettlementCurrency",
      "netAmountInPaymentCurrency",
      "netAmountInSettlementCurrency",
    ]) {
      out[0][key] = reduced;
    }
  }
  if (variant === "missingMerchant") {
    out[0].merchantId = "";
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function fileStamp(date = new Date()): string {
  // Same shape as the Java generator: 2026-02-13T10.00.00Z (+ms to keep names unique)
  return date.toISOString().replace(/:/g, ".");
}

function fileName(datasource: string, settings: GenerationSettings, stamp: string): string {
  return `${datasource}_${settings.fileReceptionConfiguration}_${settings.fileSuffix}_${stamp}.csv`;
}

/**
 * Plans a dataset in memory (no disk access). Names and values are known up front so
 * TestPoint constructors can receive them; {@link writeDataset} writes the files.
 */
export function planDataset(options: GenerationOptions, settings = generationSettings()): ScenarioDataset {
  const strategy = options.strategy ?? "documentNumberAndFop";
  const variant = options.variant ?? "valid";
  const count = options.transactionCount ?? settings.transactionCount;
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`transactionCount must be a positive integer, got ${count}`);
  }
  const paymentDate = resolvePaymentDate(options.paymentDate, settings.paymentDate);
  const currencyFor = (i: number) =>
    options.multiCurrency ? MULTI_CURRENCIES[i % MULTI_CURRENCIES.length] : settings.accountingCurrency;

  const { sales, settlements } = buildPairs(strategy, count, settings, paymentDate, currencyFor);

  let saleRows = sales.map((s) => saleRow(s, settings));
  if (options.withRefunds) {
    saleRows = sales.flatMap((s) => [saleRow(s, settings, "SALE"), saleRow(s, settings, "REFUND")]);
  }
  saleRows = applySaleVariant(saleRows, variant);
  const settlementRows = applySettlementVariant(settlements, settlements.map((s) => settlementRow(s, settings)), variant);
  const depositRows = bankDepositRows(settlements, settings);

  const now = new Date();
  const stamp = fileStamp(now);
  const runId = `${options.scenarioId.replace(/[^\w.-]+/g, "_")}_${stamp.replace(/[.:]/g, "-")}`;
  const dir = path.join(settings.outputDir, runId);

  const saleHeaders =
    variant === "corruptedStructure" ? SALE_HEADERS.filter((h) => h !== "documentNumber") : SALE_HEADERS;

  const file = (kind: GeneratedFile["kind"], datasource: string, headers: readonly string[], rows: Record<string, string>[]) => {
    const name = fileName(datasource, settings, stamp);
    return {
      kind,
      fileName: name,
      filePath: path.join(dir, name),
      count: rows.length,
      eligible: variant === "valid" ? rows.length : undefined,
      csv: toCsv(headers, rows),
    };
  };

  const first = sales[0];
  return {
    scenarioId: options.scenarioId,
    strategy,
    variant,
    dir,
    sale: file("sale", settings.saleDatasource, saleHeaders, saleRows),
    settlement: file("settlement", settings.settlementDatasource, SETTLEMENT_HEADERS, settlementRows),
    bankDeposit: file("bankDeposit", settings.bankDepositDatasource, BANK_DEPOSIT_HEADERS, depositRows),
    sales,
    settlements,
    documentNumber: first.documentNumber,
    pnrReference: first.pnrReference,
    ccBin: first.ccBin,
    ccFourLastDigits: first.ccFourLastDigits,
    approvalCode: first.approvalCode,
    fopCode: first.fopCode,
    fopSubCode: first.fopSubCode,
    currency: first.currency,
    paymentDate,
    paymentDateUi: toUi(paymentDate),
    paymentDateIso: `${paymentDate}T00:00:00Z`,
    paymentDateRange: monthRangeUi(paymentDate),
  };
}

/** Writes every file of the dataset plus a manifest.json describing it. */
export function writeDataset(dataset: ScenarioDataset, kinds: GeneratedFile["kind"][] = ["sale", "settlement", "bankDeposit"]): string[] {
  fs.mkdirSync(dataset.dir, { recursive: true });
  const written: string[] = [];
  for (const kind of kinds) {
    const file = dataset[kind];
    fs.writeFileSync(file.filePath, file.csv, "utf8");
    written.push(file.filePath);
  }
  const { sale, settlement, bankDeposit, ...rest } = dataset;
  const manifest = {
    ...rest,
    files: [sale, settlement, bankDeposit].map(({ csv, ...meta }) => meta),
  };
  fs.writeFileSync(path.join(dataset.dir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return written;
}

/** Convenience for specs: plan + options in one call. */
export function scenarioDataset(scenarioId: string, options: Omit<GenerationOptions, "scenarioId"> = {}): ScenarioDataset {
  return planDataset({ scenarioId, ...options });
}
