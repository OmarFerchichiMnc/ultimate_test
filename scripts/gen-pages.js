const fs = require("fs");
const path = require("path");

const catalog = JSON.parse(fs.readFileSync("reports/button-catalog.json", "utf8"));

function pathSlug(path) {
  return path.replace(/^\//, "").replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase() || "ROOT";
}

const HAND_MAINTAINED = new Set([
  "dashboard.page.ts",
  "fileDashboard.page.ts",
  "saleAuditTrack.page.ts",
  "settlementAuditTrack.page.ts",
  "manualMatching.page.ts",
  "matchedItems.page.ts",
  "settlementReconciliationSettings.page.ts",
]);

const PAGE_META = {
  "/dashboard": { file: "dashboard.page.ts", className: "DashboardPage" },
  "/dashboard/cash-forecast": { file: "cashForecast.page.ts", className: "CashForecastPage" },
  "/alerts": { file: "alerts.page.ts", className: "AlertsPage" },
  "/reconciliation-alerts": { file: "reconciliationAlerts.page.ts", className: "ReconciliationAlertsPage" },
  "/etl-files": { file: "fileDashboard.page.ts", className: "FileDashboardPage" },
  "/failed-transactions": { file: "failedTransactions.page.ts", className: "FailedTransactionsPage" },
  "/audit-track/sale": { file: "saleAuditTrack.page.ts", className: "SaleAuditTrackPage" },
  "/audit-track/settlement": { file: "settlementAuditTrack.page.ts", className: "SettlementAuditTrackPage" },
  "/pending-items": { file: "pendingItems.page.ts", className: "PendingItemsPage" },
  "/provisional-mismatched-items": { file: "provisionalMismatchedItems.page.ts", className: "ProvisionalMismatchedItemsPage" },
  "/installments": { file: "installments.page.ts", className: "InstallmentsPage" },
  "/matched-items": { file: "matchedItems.page.ts", className: "MatchedItemsPage" },
  "/matched-items/exceptions": { file: "matchedItemsExceptions.page.ts", className: "MatchedItemsExceptionsPage" },
  "/manual-matching": { file: "manualMatching.page.ts", className: "ManualMatchingPage" },
  "/settlement-disputes": { file: "settlementDisputes.page.ts", className: "SettlementDisputesPage" },
  "/accounting-journal": { file: "accountingJournal.page.ts", className: "AccountingJournalPage" },
  "/unaccounted-events": { file: "unaccountedEvents.page.ts", className: "UnaccountedEventsPage" },
  "/imbalanced-items": { file: "imbalancedItems.page.ts", className: "ImbalancedItemsPage" },
  "/trial-balance": { file: "trialBalance.page.ts", className: "TrialBalancePage" },
  "/post-to-ledger": { file: "postToLedger.page.ts", className: "PostToLedgerPage" },
  "/alert-type-affiliation": { file: "alertTypeAffiliation.page.ts", className: "AlertTypeAffiliationPage" },
  "/settings/file": { file: "fileSettings.page.ts", className: "FileSettingsPage" },
  "/matching-rules/settlement-reconciliation": { file: "settlementReconciliationRules.page.ts", className: "SettlementReconciliationRulesPage" },
  "/matching-rules/bank-reconciliation": { file: "bankReconciliationRules.page.ts", className: "BankReconciliationRulesPage" },
  "/settlement-reconciliation-settings": { file: "settlementReconciliationSettings.page.ts", className: "SettlementReconciliationSettingsPage" },
  "/bank-reconciliation-settings": { file: "bankReconciliationSettings.page.ts", className: "BankReconciliationSettingsPage" },
  "/accounting-rules": { file: "accountingRules.page.ts", className: "AccountingRulesPage" },
  "/accounting-periods": { file: "accountingPeriods.page.ts", className: "AccountingPeriodsPage" },
  "/chart-accounts": { file: "chartAccounts.page.ts", className: "ChartAccountsPage" },
  "/accounting-settings": { file: "accountingSettings.page.ts", className: "AccountingSettingsPage" },
  "/general-settings": { file: "generalSettings.page.ts", className: "GeneralSettingsPage" },
  "/fee-rules": { file: "feeRules.page.ts", className: "FeeRulesPage" },
  "/roe": { file: "roe.page.ts", className: "RoePage" },
  "/fx-rate-sources": { file: "fxRateSources.page.ts", className: "FxRateSourcesPage" },
  "/form-of-payments": { file: "formOfPayments.page.ts", className: "FormOfPaymentsPage" },
  "/point-of-sales": { file: "pointOfSales.page.ts", className: "PointOfSalesPage" },
  "/point-of-sales-merchant-mapping": { file: "pointOfSalesMerchantMapping.page.ts", className: "PointOfSalesMerchantMappingPage" },
  "/acquirers": { file: "acquirers.page.ts", className: "AcquirersPage" },
  "/acquirer-merchants": { file: "acquirerMerchants.page.ts", className: "AcquirerMerchantsPage" },
  "/sale-sources": { file: "saleSources.page.ts", className: "SaleSourcesPage" },
  "/audit-track/bank": { file: "bankAuditTrack.page.ts", className: "BankAuditTrackPage" },
  "/secondary-matching": { file: "secondaryMatching.page.ts", className: "SecondaryMatchingPage" },
  "/gl-details": { file: "glDetails.page.ts", className: "GlDetailsPage" },
  "/settings/transaction": { file: "transactionSettings.page.ts", className: "TransactionSettingsPage" },
  "/matching-rules/secondary-matching": { file: "secondaryMatchingRules.page.ts", className: "SecondaryMatchingRulesPage" },
  "/secondary-matching-settings": { file: "secondaryMatchingSettings.page.ts", className: "SecondaryMatchingSettingsPage" },
  "/reports": { file: "reports.page.ts", className: "ReportsPage" },
};

const ALIASES = {
  "pi pi-calendar": "dateRange",
  "pi pi-download": "download",
  "pi pi-filter": "extraFiltersButton",
  "pi pi-copy": "copy",
  "pi pi-plus": "create",
  "pi pi-pencil": "edit",
  "pi pi-eye": "view",
  "pi pi-list": "list",
  "pi pi-external-link": "openExternal",
  "pi pi-angle-up": "yearUp",
  "pi pi-angle-down": "yearDown",
  Search: "search",
  Export: "exportButton",
  "Load more": "loadMore",
  Confirm: "confirm",
  "Reset All": "resetAll",
  "Trigger now": "triggerNow",
  "Generate now": "generateNow",
  Save: "save",
  Upload: "upload",
  Refresh: "refresh",
  Replay: "replay",
  "Check now": "checkNow",
  "Calculate now": "calculateNow",
  "paginator:pi pi-angle-double-left": "paginatorFirst",
  "paginator:pi pi-angle-left": "paginatorPrev",
  "paginator:1": "paginatorPage1",
  "paginator:pi pi-angle-right": "paginatorNext",
  "paginator:pi pi-angle-double-right": "paginatorLast",
};

const RESERVED = new Set([
  "export", "class", "new", "delete", "default", "import", "from", "page", "path", "goto",
  "constructor", "name", "length", "then",
]);

function isStable(button) {
  if (/^paginator:\d+$/.test(button.name) && button.name !== "paginator:1") return false;
  if ((button.name === "10" || button.name === "5") && button.elementType === "p-dropdown") return false;
  return true;
}

function camel(name) {
  const words = name.replace(/^pi pi-/, "").replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "control";
  const raw = words.map((word, i) => {
    const lower = word.toLowerCase();
    if (i === 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("");
  return raw;
}

function uniqueName(base, used) {
  let name = base;
  let i = 2;
  while (used.has(name) || RESERVED.has(name)) {
    name = `${base}${i}`;
    i += 1;
  }
  used.add(name);
  return name;
}

function propName(button, used, searchIndex) {
  if (button.name === "Search") {
    const name = searchIndex === 0 ? "search" : "searchAdvanced";
    return uniqueName(name, used);
  }
  if (ALIASES[button.name]) return uniqueName(ALIASES[button.name], used);
  if (button.ariaLabel) return uniqueName(camel(button.ariaLabel) + (button.elementType === "div" ? "Tab" : ""), used);
  return uniqueName(camel(button.name), used);
}

function locatorExpr(button, prop, searchIndex) {
  const n = button.name;
  if (n === "Search") return `this.findNamedButton("Search", ${searchIndex})`;
  if (n === "Export") return `this.findExportButton()`;
  if (n === "Load more") return `this.findNamedButton("Load more")`;
  if (n === "Confirm") return `this.page.locator("button.ManualMatchingSelectionSummary-ConfirmButton")`;
  if (n === "Reset All") return `this.page.locator("button.ManualMatchingSelectionSummary-ResetButton")`;
  if (n === "Trigger now") return `this.findNamedButton(/trigger now/i)`;
  if (n === "Generate now") return `this.findNamedButton(/generate now/i)`;
  if (n === "Save") return `this.findNamedButton("Save")`;
  if (n === "Refresh") return `this.findNamedButton("Refresh")`;
  if (n === "Replay") return `this.findNamedButton("Replay")`;
  if (n === "Check now") return `this.page.locator("button.AccountingScheduledJobsActions-JournalEntriesBalanceCheckBtn")`;
  if (n === "Calculate now") return `this.page.locator("button.AccountingScheduledJobsActions-ClosedAccountingPeriodBalanceCalculationBtn")`;
  if (n === "Upload") return `this.page.locator(".p-fileupload-choose").first()`;
  if (n === "paginator:pi pi-angle-double-left") return `this.findPaginatorFirst()`;
  if (n === "paginator:pi pi-angle-left") return `this.findPaginatorPrev()`;
  if (n === "paginator:1") return `this.findPaginatorPage("1")`;
  if (n === "paginator:pi pi-angle-right") return `this.findPaginatorNext()`;
  if (n === "paginator:pi pi-angle-double-right") return `this.findPaginatorLast()`;
  if (n === "pi pi-calendar") return `this.findCalendarTrigger()`;
  if (n === "pi pi-filter") return `this.findExtraFilters()`;
  if (n === "pi pi-download") return `this.findIconButton("pi-download")`;
  if (n === "pi pi-copy") return `this.findCopyButton()`;
  if (n === "pi pi-eye") return `this.findIconButton("pi-eye")`;
  if (n === "pi pi-plus") return `this.findIconButton("pi-plus")`;
  if (n === "pi pi-pencil") return `this.findIconButton("pi-pencil")`;
  if (n === "pi pi-list") return `this.findIconButton("pi-list")`;
  if (n === "pi pi-external-link") return `this.page.locator("button:has(.pi-external-link)").first()`;
  if (n === "pi pi-angle-up") return `this.page.locator("button.AccountingYearFilter-InputBtnUp")`;
  if (n === "pi pi-angle-down") return `this.page.locator("button.AccountingYearFilter-InputBtnDown")`;
  if (button.ariaLabel) return `this.findTab(${JSON.stringify(button.ariaLabel)})`;
  if (button.elementType === "p-dropdown" || button.elementType === "p-multiselect") {
    return `this.findDropdown(${JSON.stringify(button.name)})`;
  }
  return `this.findNamedButton(${JSON.stringify(button.name)}).or(this.page.getByText(${JSON.stringify(button.name)}, { exact: true }))`;
}

function pascal(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function openId(routePath) {
  return `TP-OPEN-${routePath.replace(/^\//, "").replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase() || "ROOT"}`;
}

const generated = [];

for (const [routePath, items] of Object.entries(catalog)) {
  const meta = PAGE_META[routePath];
  if (!meta) throw new Error(`No meta for ${routePath}`);
  const buttons = items.filter(isStable);
  const used = new Set();
  let searchIndex = 0;
  const controls = buttons.map((button, index) => {
    const currentSearch = button.name === "Search" ? searchIndex : 0;
    const prop = propName(button, used, currentSearch);
    if (button.name === "Search") searchIndex += 1;
    const locator = locatorExpr(button, prop, currentSearch);
    const testPointId = button.testPointId || `TP-BTN-${pathSlug(routePath)}-${String(index + 1).padStart(2, "0")}`;
    return { ...button, testPointId, prop, locator, inspectClass: `Inspect${meta.className.replace(/Page$/, "")}${pascal(prop)}` };
  });

  generated.push({ routePath, ...meta, className: meta.className, controls: controls.length });

  const outFile = path.join("src/pages", meta.file);
  if (HAND_MAINTAINED.has(meta.file) && fs.existsSync(outFile)) {
    console.log(`skip existing ${meta.file}`);
    continue;
  }

  const usesLogger = controls.some((c) => c.destructive);
  const locatorFields = controls.map((c) => `  readonly ${c.prop}: Locator;`).join("\n");
  const locatorAssign = controls.map((c) => `    this.${c.prop} = ${c.locator};`).join("\n");
  const openClass = `Open${meta.className}`;
  const inspectList = controls.map((c) => `      new ${c.inspectClass}(),`).join("\n");
  const inspectClasses = controls
    .map((c) => {
      const mode = c.destructive ? "inspect-only" : "ready";
      const desc = c.destructive
        ? `Inspect (do not click) "${c.name}" on ${routePath}`
        : `Inspect "${c.name}" on ${routePath}`;
      const skip = c.destructive
        ? `\n        logger.info(\`Skipping click for destructive control ${c.testPointId}: ${c.name}\`);`
        : "";
      return `export class ${c.inspectClass} extends TestPoint {
  constructor() {
    super(
      ${JSON.stringify(c.testPointId)},
      ${JSON.stringify(desc)},
      async (page) => {
        const pom = new ${meta.className}(page);
        await pom.expectVisible(pom.${c.prop}, ${JSON.stringify(`${c.testPointId} ${c.name} on ${routePath}`)});${skip}
      },
      "*****",
      ${JSON.stringify(mode)},
    );
  }
}`;
    })
    .join("\n\n");

  const content = `import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";${usesLogger ? `\nimport { logger } from "../configuration/logger";` : ""}

export class ${meta.className} extends BasePage {
  static readonly path = ${JSON.stringify(routePath)};
  static testPoints(): TestPoint[] {
    return [
      new ${openClass}(),
${inspectList}
    ];
  }

${locatorFields}

  constructor(page: Page) {
    super(page, ${meta.className}.path);
${locatorAssign}
  }
}

export class ${openClass} extends TestPoint {
  constructor() {
    super(${JSON.stringify(openId(routePath))}, ${JSON.stringify(`Open ${routePath}`)}, async (page) => {
      const pom = new ${meta.className}(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

${inspectClasses}
`;

  fs.writeFileSync(path.join("src/pages", meta.file), content);
}

console.log(JSON.stringify({ pages: generated.length, files: generated.map((g) => `${g.file} (${g.controls})`) }, null, 2));
