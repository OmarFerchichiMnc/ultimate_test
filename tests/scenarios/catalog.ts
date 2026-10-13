import fs from "fs";
import path from "path";
import { config } from "../../src/configuration/config";
import * as fileInjection from "../../src/configuration/fileInjection";
import * as navigation from "../../src/navigation/navigationByLink";
import * as pages from "../../src/pages";
import { TestPoint } from "../../src/testpoint/TestPoint";

export type ScenarioStep = {
  scenario_id: string;
  domain: string;
  summary: string;
  preconditions: string;
  step: string;
  testpoint_class: string;
  action: string;
  expected_result: string;
};

export type Scenario = {
  id: string;
  domain: string;
  summary: string;
  preconditions: string;
  steps: ScenarioStep[];
};

const DATE = "01/01/2026 - 31/01/2026";
const PNR = "Q8E3G2";
const DOCUMENT = "2129690954587";
const constructors: Record<string, unknown> = { ...pages, ...fileInjection, ...navigation };

function parseCsv(file: string): ScenarioStep[] {
  const text = fs.readFileSync(file, "utf8");
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      records.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    records.push(row);
  }
  const [header, ...body] = records.filter((record) => record.some((value) => value !== ""));
  return body.map((values) => Object.fromEntries(header.map((name, index) => [name, values[index] ?? ""])) as ScenarioStep);
}

export function loadScenarios(): Scenario[] {
  const file = path.resolve(__dirname, "../../docs/test_scenarios/adad_test_scenarios.csv");
  const grouped = new Map<string, Scenario>();
  for (const step of parseCsv(file)) {
    const current = grouped.get(step.scenario_id) ?? {
      id: step.scenario_id,
      domain: step.domain,
      summary: step.summary,
      preconditions: step.preconditions,
      steps: [],
    };
    current.steps.push(step);
    grouped.set(step.scenario_id, current);
  }
  return [...grouped.values()];
}

function textOf(step: ScenarioStep): string {
  return `${step.action} ${step.expected_result} ${step.summary}`;
}

function mentions(step: ScenarioStep, pattern: RegExp): boolean {
  return pattern.test(textOf(step));
}

function pickStatus(step: ScenarioStep, fallback = "Accepted"): string {
  const options = [
    "Settled Discrepancy",
    "Partially Settled",
    "ON HOLD",
    "DUPLICATED",
    "MISSING",
    "LATE",
    "Accepted",
    "Rejected",
    "Complete",
    "Pending",
    "Partial",
    "Expired",
    "Deleted",
    "Exception",
    "Settled",
  ];
  const text = textOf(step);
  return options.find((option) => text.toLowerCase().includes(option.toLowerCase())) ?? fallback;
}

export function localFixture(step: ScenarioStep): "sale" | "settlement" {
  return settlementFile(step) ? "settlement" : "sale";
}

function settlementFile(step: ScenarioStep): boolean {
  return /settlement/i.test(step.action) && !/sales file|sale file|valid sales/i.test(step.action);
}

function fileTriple(step: ScenarioStep): [string, string, string] {
  if (settlementFile(step)) {
    return [config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName];
  }
  return [config.files.salePath, config.adadPaths.sales, config.files.saleFileName];
}

function transactionCount(step: ScenarioStep): number {
  const file = settlementFile(step) ? config.files.settlementFile : config.files.saleFile;
  if (!fs.existsSync(file)) return 1;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((line) => line.trim());
  return Math.max(lines.length - 1, 1);
}

function saleTab(step: ScenarioStep): "Sales" | "Refunded Sales" | "Deleted Sales" | "Expired" {
  if (mentions(step, /deleted/i)) return "Deleted Sales";
  if (mentions(step, /refund/i)) return "Refunded Sales";
  if (mentions(step, /expired/i)) return "Expired";
  return "Sales";
}

function settlementTab(step: ScenarioStep): "Settlements" | "Refunded Settlements" | "Deleted Settlements" | "Expired" {
  if (mentions(step, /deleted/i)) return "Deleted Settlements";
  if (mentions(step, /refund/i)) return "Refunded Settlements";
  if (mentions(step, /expired/i)) return "Expired";
  return "Settlements";
}

function pendingTab(step: ScenarioStep): "Pending" | "Expired" | "Deleted" {
  if (mentions(step, /deleted/i)) return "Deleted";
  if (mentions(step, /expired/i)) return "Expired";
  return "Pending";
}

function creationTable(step: ScenarioStep): "sale" | "settlement" | "payment_order" | "bank_deposit" {
  if (mentions(step, /bank deposit/i)) return "bank_deposit";
  if (mentions(step, /payment order/i)) return "payment_order";
  if (mentions(step, /settlement/i)) return "settlement";
  return "sale";
}

function matchingMode(step: ScenarioStep): string {
  if (mentions(step, /bank/i)) return "Bank Reconciliation";
  if (mentions(step, /refund debit/i)) return "Settlement vs Refund Debit";
  if (mentions(step, /sale versus refund|sale and a refund|sale vs refund/i)) return "Sale vs Refund";
  return "Settlement Reconciliation";
}

function argumentsFor(step: ScenarioStep): unknown[] {
  const name = step.testpoint_class;
  const [localPath, remotePath, fileName] = fileTriple(step);
  if (name === "PrepareIngestionFixture" || name === "FileDashboardUploadRecoveryFile") return [localPath];
  if (name === "PrepareUpload" || name === "ExecuteUpload" || name === "InjectFile") return [localPath, remotePath, fileName];
  if (name === "CheckIfFileIngested" || name === "AlertsAssertMissingFile") return [fileName];
  if (name === "FileDashboardUIFilterFileID" || name === "FileDashboardFilterUploadedFile") return [fileName];
  if (name === "FileDashboardAssertTotalTransactions") return [transactionCount(step)];
  if (name === "FileDashboardAssertIngestionStatus" || name === "FailedTransactionsAssertRecordStatus") return [pickStatus(step)];
  if (/DateRange$|FilterPaymentDate$|PaymentOrderDateRange$|ExpectedFileReceptionDate$/.test(name)) return [DATE];
  if (name === "AlertsApplyCombinedFilters") return ["File", "Missing"];
  if (name === "PendingItemsSelectDatasourceType" || name === "FileDashboardFilterDatasource") return ["Sale"];
  if (name === "PendingItemsOpenTab") return [pendingTab(step)];
  if (name === "PendingItemsAssertOnHold") return ["Missing FOP"];
  if (name === "PendingItemsAssertAccepted" || name === "AssertTransactionAccepted") return [pickStatus(step, "Accepted")];
  if (name === "PendingItemsAssertExpired" || name === "PendingItemsAssertItemOnDeletedTab" || name === "MatchedItemsAssertAtomsPending") return [DOCUMENT];
  if (name === "PointOfSalesCreateOffice") return ["OFFICE"];
  if (name === "TransactionSettingsSetExpirationThreshold") return ["adyen", "1"];
  if (name === "CashForecastSelectCustomerAcquirer") return ["adyen"];
  if (name === "CashForecastSelectCurrency") return ["EUR"];
  if (name === "FileDashboardFilterIngestionStatus") return [pickStatus(step)];
  if (name === "FailedTransactionsApplyCombinedFilters") return ["INDIRECT", "Sale"];
  if (name === "PendingItemsApplyCombinedFilters" || name === "AccountingJournalApplyCombinedFilters") return ["INDIRECT"];
  if (name === "MatchedItemsApplyCombinedFilters") return [pickStatus(step, "Complete"), "Accepted"];
  if (name === "SaleUICheckIfMatchingDoneCorrectly" || name === "MatchedItemsAssertAtomsLinked") return ["0.00"];
  if (name === "MatchedItemsAssertMoleculeStatus" || name === "ReconciliationAlertsAssertStatus" || name === "ImbalancedItemsAssertStatus" || name === "AccountingJournalAssertEntry") {
    return [pickStatus(step)];
  }
  if (name === "SaleUIFilterDocumentNumber" || name === "SettlementUIFilterDocumentNumber") return [DOCUMENT];
  if (name.endsWith("AssertLifecycleEvents")) return [[]];
  if (name === "DbShiftCreationDate") return [creationTable(step), "1", "2026-01-16T00:00:00Z"];
  if (name === "SecondaryMatchingAssertMolecule" || name.endsWith("FilterPNROrderReference") || name === "ManualMatchingSaleUIFilterPNROrderReference" || name === "ManualMatchingSettlementUIFilterPNROrderReference") {
    return [PNR];
  }
  if (name === "MatchedItemsSelectReconciliation" || name === "ManualMatchingSelectMode") return [matchingMode(step)];
  if (name === "PaymentOrderUIFilterPaymentOrderReference" || name === "SettlementUIFilterPaymentOrderReference" || name === "BankUIFilterBankDepositReference" || name === "PaymentOrderUIFilterBankDepositReference") {
    return [PNR];
  }
  if (name === "ManualMatchingAssertMatchResult") return [pickStatus(step, "Complete"), mentions(step, /partial/i) ? "Partial" : "Accepted"];
  if (name === "MatchingRulesSetStackPriority") return ["Rule 2", "Rule 3"];
  if (name === "ReconciliationAlertsFilterMolecule" || name === "GlDetailsAssertGroupHeader" || name === "ReportsAssertCoherence") return ["1"];
  if (name === "ReportsFilterAndExport") return ["Sale", "1"];
  if (name === "SaleAuditTrackOpenTab") return [saleTab(step)];
  if (name === "SettlementAuditTrackOpenTab") return [settlementTab(step)];
  if (name === "SaleUIFilterSaleID" || name === "SettlementUIFilterSettlementID" || name === "PaymentOrderUIFilterPaymentOrderID") return ["1"];
  if (name === "SaleUIFilterPaymentID" || name === "SettlementUIFilterPaymentID") return ["1"];
  if (name === "SaleUIFilterCreditCardBIN" || name === "SettlementUIFilterCreditCardBIN") return ["827919"];
  if (name === "SaleUIFilterCreditCard4LastDegits" || name === "SettlementUIFilterCreditCard4LastDegits") return ["6395"];
  if (name === "SaleUIFilterApprovalCode" || name === "SettlementUIFilterApprovalCode") return ["148256"];
  if (name === "SaleUIFilterChannelType" || name === "SaleUIFilterCountry") return [name.endsWith("Country") ? "TU" : "INDIRECT"];
  if (name === "SettlementUIFilterCountry" || name === "PaymentOrderUIFilterCustomerAcquirer" || name === "SettlementUIFilterCustomerAcquirer" || name === "BankUIFilterCustomerAcquirer") {
    return [name.endsWith("Country") ? "TU" : "adyen"];
  }
  if (name.endsWith("FilterFileID")) return [];
  if (name.endsWith("FilterFOPCode")) return ["CCVI"];
  if (name.endsWith("FilterFOPSubCode")) return ["EXTASO"];
  if (name.endsWith("FilterSettledStatus") || name === "PaymentOrderUIFilterBankedStatus") return [pickStatus(step, "Pending")];
  if (name === "SaleAuditTrackAssertAppliedRule") return ["Rule_B"];
  if (name === "AccountingRulesSetSamePriority") return ["Rule A", "Rule B"];
  if (name === "AccountingJournalAssertNoEntry" || name === "UnaccountedEventsAssertAbsent" || name === "SaleAuditTrackAssertAccountingDate") {
    return [mentions(step, /fee/i) ? "Miscellaneous fee" : "Sale received"];
  }
  if (name === "UnaccountedEventsFilterEvent") return [DATE, "Sale received", "No rule found"];
  if (name === "UnaccountedEventsAssertReason") return ["No rule found"];
  if (name === "AccountingPeriodAssertPostingDate") return ["16/01/2026"];
  if (name === "AccountingRulesSetActive") return ["Sale received", !mentions(step, /deactivat/i)];
  if (name === "AccountingRulesSetImbalance") return ["Sale received", "50", "40"];
  return [];
}

export function emittedClass(step: ScenarioStep): string {
  return step.testpoint_class === "FileDashboardUIFilterFileID" ? "FileDashboardFilterUploadedFile" : step.testpoint_class;
}

export function emittedArgs(step: ScenarioStep): unknown[] {
  return argumentsFor({ ...step, testpoint_class: emittedClass(step) });
}

export function buildScenarioPoint(step: ScenarioStep): TestPoint {
  const className = emittedClass(step);
  const ctor = constructors[className];
  if (typeof ctor !== "function") {
    throw new Error(`${step.scenario_id} step ${step.step} uses unknown TestPoint ${className}`);
  }
  return new (ctor as new (...args: unknown[]) => TestPoint)(...emittedArgs(step));
}
