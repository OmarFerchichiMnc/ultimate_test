/**
 * Bank reconciliation fixtures: payment orders (inside an acquirer settlement JSONL file)
 * and bank deposits (bank statement JSONL file). Bank reconciliation matches payment
 * orders against bank deposits, so no Sale / Settlement CSV is involved.
 *
 * Formats follow docs/test_files/bank_deposit/complete/*.jsonl (the files ADAD ingests in
 * the "adyen" and "BankDepositStandard" datasources). Amounts are in minor units
 * (20000 = 200.00).
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { generationSettings, resolvePaymentDate } from "./fileGenerator";

/** Acquirer / bank master data already configured for payment orders in ADAD (seen in 8X). */
const ACQUIRER = "adyen";
const MERCHANT_ID = "FinnairFI";
const BANK_ACCOUNT_NUMBER = "FI1116600000016400";
const BANK_IDENTIFIER_CODE = "MPDRFIAA";
const BANK_STATEMENT_SOURCE = "BankDepositStandard";

export type BankReconciliationPair = {
  paymentOrderReference: string;
  bankDepositReference: string;
  /** Major units, two decimals (e.g. "200.00"). */
  amount: string;
  currency: string;
};

export type BankReconciliationFile = {
  fileName: string;
  filePath: string;
  /** Records the dashboard should count (payment orders / bank deposits). */
  count: number;
  content: string;
};

export type BankReconciliationDataset = {
  scenarioId: string;
  dir: string;
  paymentOrder: BankReconciliationFile;
  bankDeposit: BankReconciliationFile;
  pairs: BankReconciliationPair[];
  currency: string;
  paymentOrderReference: string;
  bankDepositReference: string;
  /** yyyy-mm-dd */
  paymentDate: string;
  /** "dd/mm/yyyy - dd/mm/yyyy" covering the payment month. */
  paymentDateRange: string;
};

export type BankReconciliationOptions = {
  /** Number of payment order / bank deposit pairs (1:1). Defaults to the configured transaction count. */
  count?: number;
  /** Payment order + deposit currency. Defaults to the accounting currency (mono-currency). */
  currency?: string;
  /** yyyy-mm-dd, "today" or undefined for the configured default. */
  paymentDate?: string;
};

function hex(bytes: number): string {
  return crypto.randomBytes(bytes).toString("hex");
}

function digits(length: number): string {
  let out = String(crypto.randomInt(1, 10));
  while (out.length < length) out += String(crypto.randomInt(0, 10));
  return out;
}

function minor(amount: string): number {
  return Math.round(Number(amount) * 100);
}

function money(currency: string, amount: string) {
  return { amount: minor(amount), currency };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function monthRangeUi(isoDay: string): string {
  const [y, m] = isoDay.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `01/${pad(m)}/${y} - ${pad(last)}/${pad(m)}/${y}`;
}

function jsonl(records: object[]): string {
  return records.map((record) => JSON.stringify(record)).join("\n") + "\n";
}

function md5(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

function paymentOrderFile(pairs: BankReconciliationPair[], airline: string, timestamp: string): string {
  const records: object[] = [
    {
      recordType: "header",
      version: "1.4.2",
      airlineCode: airline,
      acquirer: ACQUIRER,
      fileName: "original_file_name.csv",
      acquirerSendingDate: timestamp,
      recordCount: pairs.length,
      recordDuplicationCheckFields: ["recordId"],
    },
  ];
  for (const pair of pairs) {
    const batchId = digits(9);
    records.push({
      recordType: "payment_order",
      recordId: hex(32),
      paymentOrderReference: pair.paymentOrderReference,
      paymentOrderDate: timestamp,
      netAmountInSettlementCurrency: money(pair.currency, pair.amount),
      bankAccountNumber: BANK_ACCOUNT_NUMBER,
      bankDepositReference: pair.bankDepositReference,
      batchId,
      merchantId: MERCHANT_ID,
    });
    // One settled transaction per payment order, for the same net amount, so the payment
    // order's calculated net (sum of its transactions) equals its declared net.
    const amount = money(pair.currency, pair.amount);
    const zero = money(pair.currency, "0");
    records.push({
      recordType: "transaction",
      recordId: hex(32),
      serviceType: "passenger",
      acquirerReferenceNumber: `ARN${digits(8)}`,
      countryOfSale: "FR",
      countryOfSettlement: "FR",
      transactionType: "settlement",
      merchantId: MERCHANT_ID,
      documentNumber: `212${digits(10)}`,
      pnrNumber: `PNR${digits(4)}`,
      orderId: `ORDER${digits(6)}`,
      grossAmountInTransactionCurrency: amount,
      grossAmountInSettlementCurrency: amount,
      vatAmountInSettlementCurrency: zero,
      netAmountInSettlementCurrency: amount,
      mcpFxRate: 0,
      dccMarkUpAmountInSettlementCurrency: zero,
      originalTransactionDate: timestamp,
      transactionDate: timestamp,
      settlementDate: timestamp,
      paymentReference: `PAY${digits(6)}`,
      paymentMethod: "visa",
      paymentStatus: "paid",
      fopCode: "CCVI",
      fopSubCode: "EXTASO",
      creditCard: {
        cardBin: Number(digits(6)),
        cardFourLastDigits: Number(digits(4)),
        cardNumber: `${digits(6)}****${digits(4)}`,
      },
      approvalCode: digits(6),
      installment: {
        totalNumber: 0,
        currentNumber: 0,
        firstInstallmentAmountInSettlementCurrency: zero,
        installmentAmountInSettlementCurrency: zero,
      },
      bankAccountId: digits(12),
      batchId,
      invoiceId: `INV${digits(6)}`,
      summaryId: `SUM${digits(6)}`,
      terminalId: "TERM001",
      blendedFee: { amountInSettlementCurrency: zero, rate: 0 },
      cardSchemeFeeAmountInSettlementCurrency: zero,
      interchangeFeeAmountInSettlementCurrency: zero,
      markupFeeAmountInSettlementCurrency: zero,
      chargeAmounts: [],
      paymentOrderReference: pair.paymentOrderReference,
    });
  }
  return jsonl(records);
}

function bankDepositFile(pairs: BankReconciliationPair[], airline: string, timestamp: string): string {
  const records: object[] = [
    {
      version: "1.0.1",
      airlineCode: airline,
      bankStatementSource: BANK_STATEMENT_SOURCE,
      fileName: "original_file_name.csv",
      bankSendingDate: timestamp,
      recordCount: pairs.length,
      recordDuplicationCheckFields: ["recordId"],
    },
  ];
  for (const pair of pairs) {
    records.push({
      recordId: hex(32),
      bankIdentifierCode: BANK_IDENTIFIER_CODE,
      acquirerName: ACQUIRER,
      bankAccountNumber: BANK_ACCOUNT_NUMBER,
      bankGrossAmountInDepositCurrency: money(pair.currency, pair.amount),
      // No bank fees: net deposit equals the payment order net amount.
      bankFeeAmountInDepositCurrency: [],
      bankNetAmountInDepositCurrency: money(pair.currency, pair.amount),
      depositSigning: "credit",
      depositDate: timestamp,
      description: "Generated by ultimate-test",
      bankDepositReference: pair.bankDepositReference,
    });
  }
  return jsonl(records);
}

/**
 * Plans payment order + bank deposit files in memory. Every payment order has exactly one
 * bank deposit with the same bank deposit reference, amount and currency (1:1), which is
 * what the bank reconciliation rules match on (BANK_DEPOSIT_REFERENCE, AMOUNT + CURRENCY).
 */
export function bankReconciliationDataset(
  scenarioId: string,
  options: BankReconciliationOptions = {},
): BankReconciliationDataset {
  const settings = generationSettings();
  const count = options.count ?? settings.transactionCount;
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`count must be a positive integer, got ${count}`);
  }
  const currency = options.currency ?? settings.accountingCurrency;
  const paymentDate = resolvePaymentDate(options.paymentDate, settings.paymentDate);
  const timestamp = `${paymentDate}T09:00:00Z`;

  const pairs: BankReconciliationPair[] = Array.from({ length: count }, () => ({
    paymentOrderReference: `PO${digits(10)}`,
    bankDepositReference: crypto.randomUUID(),
    amount: (crypto.randomInt(10_000, 100_001) / 100).toFixed(2),
    currency,
  }));

  const now = new Date();
  const runId = `${scenarioId.replace(/[^\w.-]+/g, "_")}_${now.toISOString().replace(/[.:]/g, "-")}`;
  const dir = path.join(settings.outputDir, runId);
  const sequence = digits(6);

  const poContent = paymentOrderFile(pairs, settings.airline, timestamp);
  const bdContent = bankDepositFile(pairs, settings.airline, timestamp);
  // Same naming as the files ADAD receives: <type>_AY_<source>_<seq>_<id>_<md5 of content>.jsonl
  const poName = `settlement_AY_${ACQUIRER}_${sequence}_${crypto.randomUUID()}_${md5(poContent)}.jsonl`;
  const bdName = `bank_deposit_AY_nomentia_${sequence}_${crypto.randomUUID()}_${md5(bdContent)}.jsonl`;

  return {
    scenarioId,
    dir,
    paymentOrder: { fileName: poName, filePath: path.join(dir, poName), count, content: poContent },
    bankDeposit: { fileName: bdName, filePath: path.join(dir, bdName), count, content: bdContent },
    pairs,
    currency,
    paymentOrderReference: pairs[0].paymentOrderReference,
    bankDepositReference: pairs[0].bankDepositReference,
    paymentDate,
    paymentDateRange: monthRangeUi(paymentDate),
  };
}

/** Writes the payment order and bank deposit files of the dataset into dataset.dir. */
export class GenerateBankReconciliationFiles extends TestPoint {
  constructor(dataset: BankReconciliationDataset) {
    super("TP-GEN-002", `Generate payment order and bank deposit files for ${dataset.scenarioId}`, async () => {
      fs.mkdirSync(dataset.dir, { recursive: true });
      for (const file of [dataset.paymentOrder, dataset.bankDeposit]) {
        fs.writeFileSync(file.filePath, file.content, "utf8");
      }
      fs.writeFileSync(
        path.join(dataset.dir, "manifest.json"),
        JSON.stringify(
          { ...dataset, paymentOrder: dataset.paymentOrder.fileName, bankDeposit: dataset.bankDeposit.fileName },
          null,
          2,
        ),
      );
      logger.info(`Generated ${dataset.paymentOrder.fileName} and ${dataset.bankDeposit.fileName} in ${dataset.dir}`);
      for (const pair of dataset.pairs) {
        logger.info(
          `Pair PO ${pair.paymentOrderReference} <-> BD ${pair.bankDepositReference}: ${pair.currency} ${pair.amount}`,
        );
      }
    });
  }
}
