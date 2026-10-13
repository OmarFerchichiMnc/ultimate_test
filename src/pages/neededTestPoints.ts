import fs from "fs";
import path from "path";
import { expect, Page } from "@playwright/test";
import { logger } from "../configuration/logger";
import { CreationDateTable, shiftCreationDate } from "../configuration/database";
import { TestPoint } from "../testpoint/TestPoint";
import { AccountingJournalPage } from "./accountingJournal.page";
import { AccountingRulesPage } from "./accountingRules.page";
import { AccountingSettingsPage } from "./accountingSettings.page";
import { AlertsPage } from "./alerts.page";
import { BankAuditTrackPage } from "./bankAuditTrack.page";
import { BankReconciliationSettingsPage } from "./bankReconciliationSettings.page";
import { CashForecastPage } from "./cashForecast.page";
import { FailedTransactionsPage } from "./failedTransactions.page";
import { FileDashboardPage } from "./fileDashboard.page";
import { GeneralSettingsPage } from "./generalSettings.page";
import { GlDetailsPage } from "./glDetails.page";
import { ImbalancedItemsPage } from "./imbalancedItems.page";
import { ManualMatchingPage } from "./manualMatching.page";
import { MatchedItemsPage } from "./matchedItems.page";
import { PaymentOrderAuditTrackPage } from "./paymentOrderAuditTrack.page";
import { PendingItemsPage } from "./pendingItems.page";
import { PointOfSalesPage } from "./pointOfSales.page";
import { PostToLedgerPage } from "./postToLedger.page";
import { ReconciliationAlertsPage } from "./reconciliationAlerts.page";
import { ReportsPage } from "./reports.page";
import { SaleAuditTrackPage } from "./saleAuditTrack.page";
import {
  assertAnyStatus,
  assertColumn,
  assertDetailsContain,
  assertLastExportHasLines,
  assertLastExportMatchesGrid,
  assertTableOmits,
  cellByHeader,
  lastExportPath,
  assertText,
  clearFilters,
  clickNamed,
  confirmAction,
  confirmYes,
  downloadExport,
  dropdownByLabel,
  exportButton,
} from "./scenarioSupport";
import { SecondaryMatchingPage } from "./secondaryMatching.page";
import { SecondaryMatchingSettingsPage } from "./secondaryMatchingSettings.page";
import { SettlementAuditTrackPage } from "./settlementAuditTrack.page";
import { SettlementReconciliationRulesPage } from "./settlementReconciliationRules.page";
import { TransactionSettingsPage } from "./transactionSettings.page";
import { TrialBalancePage } from "./trialBalance.page";
import { UnaccountedEventsPage } from "./unaccountedEvents.page";
import { BasePage } from "./BasePage";

async function selectTwoPanes(pom: BasePage): Promise<void> {
  const tables = pom.page.locator("p-table");
  const count = await tables.count();
  if (count >= 2) {
    await tables.nth(0).locator(".p-checkbox, [role=checkbox]").first().click();
    await tables.nth(1).locator(".p-checkbox, [role=checkbox]").first().click();
    return;
  }
  const boxes = pom.page.locator(".p-checkbox, [role=checkbox]");
  await boxes.nth(0).click();
  await boxes.nth(1).click();
}

async function setRulePriority(page: Page, ruleName: string, priority: string): Promise<void> {
  const row = page.getByRole("row").filter({ hasText: ruleName }).first();
  await expect(row, `Rule row '${ruleName}'`).toBeVisible();
  const edit = row.getByRole("button").filter({ has: page.locator(".pi-pencil") }).first();
  await edit.click();
  const priorityInput = page.getByLabel(/priority/i).or(page.getByPlaceholder(/priority/i)).first();
  await expect(priorityInput).toBeVisible();
  await priorityInput.fill(priority);
  await page.getByRole("button", { name: /save/i }).first().click();
  logger.info(`Set ${ruleName} priority to ${priority}`);
}

export class PrepareIngestionFixture extends TestPoint {
  constructor(fixturePath: string) {
    super("TP-NEW-001", `Prepare ingestion fixture ${fixturePath}`, async () => {
      const full = path.isAbsolute(fixturePath) ? fixturePath : path.resolve(process.cwd(), fixturePath);
      if (!fs.existsSync(full)) {
        throw new Error(`Ingestion fixture not found: ${full}`);
      }
      const stat = fs.statSync(full);
      if (stat.isDirectory() && fs.readdirSync(full).filter((name) => !name.startsWith(".")).length === 0) {
        throw new Error(`Ingestion fixture directory is empty: ${full}`);
      }
      logger.info(`Ingestion fixture ready: ${full}`);
    });
  }
}

export class FileDashboardAssertIngestionStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-002", `Assert file ingestion status ${status}`, async (page) => {
      await assertColumn(new FileDashboardPage(page), /status/i, status);
    });
  }
}

export class FileDashboardAssertTotalTransactions extends TestPoint {
  constructor(expectedCount: number) {
    super("TP-NEW-003", `Assert total transactions is ${expectedCount}`, async (page) => {
      const actual = await assertCount(new FileDashboardPage(page), /total/i, expectedCount);
      logger.info(`Total transactions is ${actual}`);
    });
  }
}

async function assertCount(pom: BasePage, header: RegExp, expected: number): Promise<string> {
  const actual = await cellByHeader(pom, header);
  const parsed = Number(actual.replace(/[^\d.-]/g, ""));
  if (parsed !== expected) {
    throw new Error(`Expected ${expected} in ${header}, got '${actual}'`);
  }
  return actual;
}

export class FileDashboardFilterIngestionStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-004", `Filter file dashboard by status ${status}`, async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.selectDropdownOption(dropdownByLabel(pom, /status/i), status);
    });
  }
}

export class FileDashboardFilterDatasource extends TestPoint {
  constructor(datasource: string) {
    super("TP-NEW-005", `Filter file dashboard by datasource ${datasource}`, async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.selectDropdownOption(dropdownByLabel(pom, /datasource|source/i), datasource);
    });
  }
}

export class FileDashboardClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-006", "Clear File Dashboard filters", async (page) => {
      await clearFilters(new FileDashboardPage(page));
    });
  }
}

export class FileDashboardClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-007", "Export the File Dashboard grid", async (page) => {
      const pom = new FileDashboardPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class FileDashboardAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-008", "Assert the File Dashboard export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new FileDashboardPage(page));
    });
  }
}

export class FileDashboardUploadRecoveryFile extends TestPoint {
  constructor(filePath: string) {
    super("TP-NEW-009", `Upload recovery file ${filePath}`, async (page) => {
      const pom = new FileDashboardPage(page);
      const full = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      await pom.page.locator("input[type=file]").first().setInputFiles(full);
      logger.info(`Recovery file selected: ${full}`);
    });
  }
}

export class FileDashboardAssertRecoveryBadge extends TestPoint {
  constructor() {
    super("TP-NEW-010", "Assert the recovered file is Accepted", async (page) => {
      const pom = new FileDashboardPage(page);
      await assertText(pom, "recovery");
      await assertColumn(pom, /status/i, "Accepted");
    });
  }
}

export class DbShiftCreationDate extends TestPoint {
  constructor(table: CreationDateTable, id: string, createdDate: string) {
    super("TP-NEW-011", `Shift ${table} ${id} created date to ${createdDate}`, async () => {
      await shiftCreationDate(table, id, createdDate);
    });
  }
}

export class FailedTransactionsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-012", `Filter failed transactions by ${date}`, async (page) => {
      const pom = new FailedTransactionsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class FailedTransactionsApplyCombinedFilters extends TestPoint {
  constructor(channelType: string, datasource: string) {
    super("TP-NEW-013", "Apply failed-transaction status and datasource filters", async (page) => {
      const pom = new FailedTransactionsPage(page);
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
      await pom.selectDropdownOption(pom.saleSource, datasource);
    });
  }
}

export class FailedTransactionsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-014", "Click Search on Failed Transactions", async (page) => {
      await new FailedTransactionsPage(page).search.click();
    });
  }
}

export class FailedTransactionsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-015", "Clear Failed Transactions filters", async (page) => {
      await clearFilters(new FailedTransactionsPage(page));
    });
  }
}

export class FailedTransactionsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-016", "Export failed transactions", async (page) => {
      const pom = new FailedTransactionsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class FailedTransactionsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-017", "Assert the failed-transactions export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new FailedTransactionsPage(page));
    });
  }
}

export class FailedTransactionsAssertRecordStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-018", `Assert failed record status ${status}`, async (page) => {
      await new FailedTransactionsPage(page).expectTableContains(status);
    });
  }
}

export class PendingItemsSelectDatasourceType extends TestPoint {
  constructor(datasource: string) {
    super("TP-NEW-019", `Select pending-items datasource ${datasource}`, async (page) => {
      const pom = new PendingItemsPage(page);
      const tab = pom.page.getByRole("button", { name: new RegExp(`^${datasource}$`, "i") });
      if (await tab.first().isVisible().catch(() => false)) {
        await tab.first().click();
        return;
      }
      await pom.selectDropdownOption(pom.saleSource, datasource);
    });
  }
}

export class PendingItemsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-020", `Filter pending items by ${date}`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class PendingItemsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-021", "Click Search on Pending Items", async (page) => {
      await new PendingItemsPage(page).search.click();
    });
  }
}

export class PendingItemsOpenTab extends TestPoint {
  constructor(tab: "Pending" | "Expired" | "Deleted") {
    super("TP-NEW-022", `Open pending items ${tab} tab`, async (page) => {
      const pom = new PendingItemsPage(page);
      const target = tab === "Pending" ? pom.pendingTab : tab === "Expired" ? pom.expiredTab : pom.deletedTab;
      await target.click();
    });
  }
}

export class PendingItemsAssertListNotEmpty extends TestPoint {
  constructor() {
    super("TP-NEW-023", "Assert pending items lists rows with Delete", async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.expectTableHasRows();
      const remove = pom.tableRows().first().locator("button").filter({ has: pom.page.locator(".pi-trash") });
      const named = pom.tableRows().first().getByRole("button", { name: /delete/i });
      await expect(remove.or(named).first()).toBeVisible();
    });
  }
}

export class PendingItemsDeleteFirstItem extends TestPoint {
  constructor() {
    super("TP-NEW-024", "Delete the first pending item", async (page) => {
      const pom = new PendingItemsPage(page);
      const row = pom.tableRows().first();
      const remove = row.locator("button").filter({ has: pom.page.locator(".pi-trash") });
      const named = row.getByRole("button", { name: /delete/i });
      await remove.or(named).first().click();
      await confirmYes(pom);
    });
  }
}

export class PendingItemsAssertItemOnDeletedTab extends TestPoint {
  constructor(itemText: string) {
    super("TP-NEW-025", `Assert deleted item ${itemText}`, async (page) => {
      await new PendingItemsPage(page).expectTableContains(itemText);
    });
  }
}

export class PendingItemsAssertAccepted extends TestPoint {
  constructor(itemText = "Accepted") {
    super("TP-NEW-026", `Assert pending item is accepted (${itemText})`, async (page) => {
      await new PendingItemsPage(page).expectTableContains(itemText);
    });
  }
}

export class PendingItemsAssertOnHold extends TestPoint {
  constructor(message: string) {
    super("TP-NEW-027", `Assert ON HOLD: ${message}`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.expectTableContains("ON HOLD");
      await assertText(pom, message);
    });
  }
}

export class PendingItemsAssertExpired extends TestPoint {
  constructor(itemText: string) {
    super("TP-NEW-028", `Assert expired item ${itemText}`, async (page) => {
      await new PendingItemsPage(page).expectTableContains(itemText);
    });
  }
}

export class PendingItemsApplyCombinedFilters extends TestPoint {
  constructor(channelType: string) {
    super("TP-NEW-029", `Apply pending-items channel filter ${channelType}`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
    });
  }
}

export class PendingItemsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-030", "Clear Pending Items filters", async (page) => {
      await clearFilters(new PendingItemsPage(page));
    });
  }
}

export class PendingItemsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-031", "Export pending items", async (page) => {
      const pom = new PendingItemsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class PendingItemsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-032", "Assert the pending-items export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new PendingItemsPage(page));
    });
  }
}

export class TransactionSettingsSetExpirationThreshold extends TestPoint {
  constructor(datasource: string, threshold: string) {
    super("TP-NEW-033", `Set expiration threshold ${threshold} for ${datasource}`, async (page) => {
      const pom = new TransactionSettingsPage(page);
      await pom.selectDropdownOption(pom.acquirer, datasource);
      const input = pom.page.getByLabel(/expir/i).or(pom.page.getByPlaceholder(/expir/i)).first();
      await expect(input).toBeVisible();
      await input.fill(threshold);
      await pom.page.getByRole("button", { name: /save/i }).first().click();
    });
  }
}

export class PointOfSalesCreateOffice extends TestPoint {
  constructor(officeId: string) {
    super("TP-NEW-034", `Create point of sale ${officeId}`, async (page) => {
      const pom = new PointOfSalesPage(page);
      await pom.create.click();
      const dialog = pom.page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await dialog.getByRole("textbox").first().fill(officeId);
      await dialog.getByRole("button", { name: /save|create/i }).first().click();
    });
  }
}

export class GeneralSettingsReplayFailedTransactions extends TestPoint {
  constructor() {
    super("TP-NEW-035", "Replay failed transactions from General Settings", async (page) => {
      await confirmAction(new GeneralSettingsPage(page), /replay/i);
    });
  }
}

export class AssertTransactionAccepted extends TestPoint {
  constructor(itemText = "Accepted") {
    super("TP-NEW-036", `Assert transaction is now accepted (${itemText})`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.expectOnPage();
      await pom.expectTableContains(itemText);
    });
  }
}

export class CashForecastFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-037", `Filter cash forecast by ${date}`, async (page) => {
      const pom = new CashForecastPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class CashForecastSelectCustomerAcquirer extends TestPoint {
  constructor(name: string) {
    super("TP-NEW-038", `Select cash forecast customer ${name}`, async (page) => {
      const pom = new CashForecastPage(page);
      await pom.selectDropdownOption(pom.selectCustomerAcquirer, name);
    });
  }
}

export class CashForecastSelectCurrency extends TestPoint {
  constructor(currency: string) {
    super("TP-NEW-039", `Select cash forecast currency ${currency}`, async (page) => {
      const pom = new CashForecastPage(page);
      await pom.selectDropdownOption(dropdownByLabel(pom, /currency/i), currency);
    });
  }
}

export class CashForecastRefresh extends TestPoint {
  constructor() {
    super("TP-NEW-040", "Refresh cash forecast KPIs", async (page) => {
      const pom = new CashForecastPage(page);
      const refresh = pom.page.getByRole("button", { name: /refresh/i });
      if (await refresh.first().isVisible().catch(() => false)) {
        await refresh.first().click();
        return;
      }
      await pom.search.click();
    });
  }
}

export class CashForecastAssertDiagram extends TestPoint {
  constructor() {
    super("TP-NEW-041", "Assert the cash forecast diagram is displayed", async (page) => {
      const pom = new CashForecastPage(page);
      await expect(pom.page.locator("canvas, svg, p-chart, .p-chart").first()).toBeVisible();
    });
  }
}

export class AlertsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-042", `Filter alerts by ${date}`, async (page) => {
      const pom = new AlertsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class AlertsApplyCombinedFilters extends TestPoint {
  constructor(category: string, type: string) {
    super("TP-NEW-043", `Filter alerts by ${category} / ${type}`, async (page) => {
      const pom = new AlertsPage(page);
      await pom.selectDropdownOption(pom.selectCategory, category);
      await pom.selectDropdownOption(pom.selectType, type);
    });
  }
}

export class AlertsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-044", "Click Search on Alerts", async (page) => {
      await new AlertsPage(page).search.click();
    });
  }
}

export class AlertsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-045", "Clear Alerts filters", async (page) => {
      await clearFilters(new AlertsPage(page));
    });
  }
}

export class AlertsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-046", "Export alerts", async (page) => {
      const pom = new AlertsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class AlertsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-047", "Assert the alerts export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new AlertsPage(page));
    });
  }
}

export class AlertsAssertMissingFile extends TestPoint {
  constructor(fileName: string) {
    super("TP-NEW-048", `Assert missing-file alert for ${fileName}`, async (page) => {
      const pom = new AlertsPage(page);
      await pom.expectTableContains(fileName);
    });
  }
}

export class BankReconciliationClickTriggerNow extends TestPoint {
  constructor() {
    super("TP-NEW-049", "Click Trigger now on bank reconciliation settings", async (page) => {
      await new BankReconciliationSettingsPage(page).triggerNow.click();
    });
  }
}

export class SecondaryMatchingClickTriggerNow extends TestPoint {
  constructor() {
    super("TP-NEW-050", "Click Trigger now on secondary matching settings", async (page) => {
      await new SecondaryMatchingSettingsPage(page).triggerNow.click();
    });
  }
}

export class MatchingRulesSetStackPriority extends TestPoint {
  constructor(highRule: string, lowRule: string) {
    super("TP-NEW-051", `Set ${highRule} above ${lowRule}`, async (page) => {
      await new SettlementReconciliationRulesPage(page).expectOnPage();
      await setRulePriority(page, highRule, "1");
      await setRulePriority(page, lowRule, "2");
    });
  }
}

export class MatchedItemsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-052", `Filter matched items by ${date}`, async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class MatchedItemsSelectReconciliation extends TestPoint {
  constructor(mode: string) {
    super("TP-NEW-053", `Select reconciliation ${mode}`, async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.selectDropdownOption(pom.settlementReconciliation, mode);
    });
  }
}

export class MatchedItemsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-054", "Click Search on Matched Items", async (page) => {
      await new MatchedItemsPage(page).search.click();
    });
  }
}

export class MatchedItemsAssertMoleculeStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-055", `Assert molecule status ${status}`, async (page) => {
      await assertAnyStatus(new MatchedItemsPage(page), status);
    });
  }
}

export class MatchedItemsOpenMolecule extends TestPoint {
  constructor() {
    super("TP-NEW-056", "Open the first molecule", async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.view.first().click();
      await expect(pom.page.locator(".p-dialog, .p-sidebar").last()).toBeVisible();
    });
  }
}

export class MatchedItemsAssertAtomsLinked extends TestPoint {
  constructor(expectedBalance: string) {
    super("TP-NEW-057", `Assert linked atoms and balance ${expectedBalance}`, async (page) => {
      const pom = new MatchedItemsPage(page);
      const detail = pom.page.locator(".p-dialog, .p-sidebar").last();
      await expect(detail).toBeVisible();
      expect(await detail.getByRole("row").count()).toBeGreaterThan(1);
      if (expectedBalance) {
        await assertText(pom, expectedBalance, detail);
      }
    });
  }
}

export class MatchedItemsUnmatch extends TestPoint {
  constructor() {
    super("TP-NEW-058", "Unmatch the molecule", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /unmatch/i);
    });
  }
}

export class MatchedItemsMarkComplete extends TestPoint {
  constructor() {
    super("TP-NEW-059", "Mark the molecule complete", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /mark as complete|complete/i);
    });
  }
}

export class MatchedItemsDetachAtom extends TestPoint {
  constructor() {
    super("TP-NEW-060", "Detach an atom from the molecule", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /detach/i);
    });
  }
}

export class MatchedItemsSealMolecule extends TestPoint {
  constructor() {
    super("TP-NEW-061", "Seal the molecule", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /seal/i);
    });
  }
}

export class MatchedItemsApplyCombinedFilters extends TestPoint {
  constructor(matchingStatus: string, reconciliationStatus: string) {
    super("TP-NEW-062", "Apply matched-item status filters", async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.selectDropdownOption(pom.selectMatchingStatus, matchingStatus);
      await pom.selectDropdownOption(pom.selectReconciliationStatus, reconciliationStatus);
    });
  }
}

export class MatchedItemsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-063", "Clear Matched Items filters", async (page) => {
      await clearFilters(new MatchedItemsPage(page));
    });
  }
}

export class MatchedItemsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-064", "Export matched items", async (page) => {
      const pom = new MatchedItemsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class MatchedItemsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-065", "Assert the matched-items export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new MatchedItemsPage(page));
    });
  }
}

export class MatchedItemsOpenAccountingPreview extends TestPoint {
  constructor() {
    super("TP-NEW-066", "Open accounting preview", async (page) => {
      const pom = new MatchedItemsPage(page);
      await clickNamed(pom, /accounting/i);
      await expect(pom.page.locator(".p-dialog, .p-sidebar").last()).toBeVisible();
    });
  }
}

export class MatchedItemsAssertClearingNeutralized extends TestPoint {
  constructor() {
    super("TP-NEW-067", "Assert clearing accounts are neutralized", async (page) => {
      const pom = new MatchedItemsPage(page);
      await assertText(pom, "0");
    });
  }
}

export class MatchedItemsAssertAtomsPending extends TestPoint {
  constructor(itemText: string) {
    super("TP-NEW-068", `Assert atom is pending (${itemText})`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.goto();
      await pom.expectTableContains(itemText);
    });
  }
}

export class ManualMatchingSelectMode extends TestPoint {
  constructor(mode: string) {
    super("TP-NEW-069", `Select manual matching mode ${mode}`, async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.selectDropdownOption(pom.settlementReconciliation, mode);
    });
  }
}

export class ManualMatchingFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-070", `Filter manual matching by ${date}`, async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class ManualMatchingSelectBankPair extends TestPoint {
  constructor() {
    super("TP-NEW-071", "Select a payment order and a bank deposit", async (page) => {
      await selectTwoPanes(new ManualMatchingPage(page));
    });
  }
}

export class ManualMatchingSelectSaleRefundPair extends TestPoint {
  constructor() {
    super("TP-NEW-072", "Select a sale and a refund", async (page) => {
      await selectTwoPanes(new ManualMatchingPage(page));
    });
  }
}

export class ManualMatchingSelectSettlementRefundDebitPair extends TestPoint {
  constructor() {
    super("TP-NEW-073", "Select a settlement and a refund debit", async (page) => {
      await selectTwoPanes(new ManualMatchingPage(page));
    });
  }
}

export class ManualMatchingAssertMatchResult extends TestPoint {
  constructor(matchingStatus: string, reconciliationStatus: string) {
    super("TP-NEW-074", `Assert match ${matchingStatus} / ${reconciliationStatus}`, async (page) => {
      const pom = new ManualMatchingPage(page);
      await assertText(pom, matchingStatus);
      await assertText(pom, reconciliationStatus);
    });
  }
}

export class SaleAuditTrackOpenTab extends TestPoint {
  constructor(tab: "Sales" | "Refunded Sales" | "Deleted Sales" | "Expired") {
    super("TP-NEW-075", `Open sale audit tab ${tab}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      const target =
        tab === "Sales"
          ? pom.salesTab
          : tab === "Refunded Sales"
            ? pom.refundedSalesTab
            : tab === "Deleted Sales"
              ? pom.deletedSalesTab
              : pom.page.getByRole("button", { name: /expired/i }).first();
      await target.click();
    });
  }
}

export class SaleAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-076", "Assert sale audit events", async (page) => {
      await assertDetailsContain(new SaleAuditTrackPage(page), fragments);
    });
  }
}

export class SaleAuditTrackClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-077", "Export the sale audit grid", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class SaleAuditTrackAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-078", "Assert the sale export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new SaleAuditTrackPage(page));
    });
  }
}

export class SaleAuditTrackOpenAccountingDetails extends TestPoint {
  constructor() {
    super("TP-NEW-079", "Open sale accounting details", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await clickNamed(pom, /accounting/i);
    });
  }
}

export class SaleAuditTrackOpenGroupHeader extends TestPoint {
  constructor() {
    super("TP-NEW-080", "Open the group header from accounting details", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      const link = pom.page.getByRole("link").or(pom.page.getByRole("button", { name: /group header/i }));
      await link.first().click();
      await expect(pom.page).toHaveURL(/gl-details/);
    });
  }
}

export class SaleAuditTrackAssertAppliedRule extends TestPoint {
  constructor(ruleName: string) {
    super("TP-NEW-081", `Assert applied rule ${ruleName}`, async (page) => {
      await assertText(new SaleAuditTrackPage(page), ruleName);
    });
  }
}

export class SaleAuditTrackAssertAccountingDate extends TestPoint {
  constructor(eventText: string) {
    super("TP-NEW-082", `Assert accounting date event ${eventText}`, async (page) => {
      await assertText(new SaleAuditTrackPage(page), eventText);
    });
  }
}

export class SettlementAuditTrackOpenTab extends TestPoint {
  constructor(tab: "Settlements" | "Refunded Settlements" | "Deleted Settlements" | "Expired") {
    super("TP-NEW-083", `Open settlement audit tab ${tab}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      const target =
        tab === "Settlements"
          ? pom.settlementsTab
          : tab === "Refunded Settlements"
            ? pom.refundedSettlementsTab
            : tab === "Deleted Settlements"
              ? pom.deletedSettlementsTab
              : pom.page.getByRole("button", { name: /expired/i }).first();
      await target.click();
    });
  }
}

export class SettlementAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-084", "Assert settlement audit events", async (page) => {
      await assertDetailsContain(new SettlementAuditTrackPage(page), fragments);
    });
  }
}

export class SettlementAuditTrackClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-085", "Export the settlement audit grid", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class SettlementAuditTrackAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-086", "Assert the settlement export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new SettlementAuditTrackPage(page));
    });
  }
}

export class PaymentOrderAuditTrackOpenDeleted extends TestPoint {
  constructor() {
    super("TP-NEW-087", "Open deleted payment orders", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.host.getByRole("button", { name: /deleted/i }).first().click();
    });
  }
}

export class PaymentOrderAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-088", "Assert payment order audit events", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await assertDetailsContain(pom, fragments, pom.host);
    });
  }
}

export class PaymentOrderAuditTrackClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-089", "Export payment orders", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class PaymentOrderAuditTrackAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-090", "Assert the payment order export matches the grid", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await assertLastExportMatchesGrid(pom, pom.host);
    });
  }
}

export class BankAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-091", "Assert bank deposit audit events", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await assertDetailsContain(pom, fragments, pom.host);
    });
  }
}

export class SecondaryMatchingAssertMolecule extends TestPoint {
  constructor(reference: string) {
    super("TP-NEW-092", `Assert secondary molecule ${reference}`, async (page) => {
      await new SecondaryMatchingPage(page).expectTableContains(reference);
    });
  }
}

export class ReconciliationAlertsFilterMolecule extends TestPoint {
  constructor(moleculeId: string) {
    super("TP-NEW-093", `Filter reconciliation alerts by ${moleculeId}`, async (page) => {
      const pom = new ReconciliationAlertsPage(page);
      const box = pom.page.getByRole("textbox").first();
      await box.fill(moleculeId);
      await pom.search.click();
    });
  }
}

export class ReconciliationAlertsAssign extends TestPoint {
  constructor() {
    super("TP-NEW-094", "Assign the discrepancy alert", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /assign/i);
    });
  }
}

export class ReconciliationAlertsAccept extends TestPoint {
  constructor() {
    super("TP-NEW-095", "Accept the discrepancy", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /accept/i);
    });
  }
}

export class ReconciliationAlertsDispute extends TestPoint {
  constructor() {
    super("TP-NEW-096", "Dispute the discrepancy", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /dispute/i);
    });
  }
}

export class ReconciliationAlertsResolve extends TestPoint {
  constructor() {
    super("TP-NEW-097", "Resolve the discrepancy", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /resolve/i);
    });
  }
}

export class ReconciliationAlertsAssertStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-098", `Assert alert status ${status}`, async (page) => {
      await assertAnyStatus(new ReconciliationAlertsPage(page), status);
    });
  }
}

export class ReportsFilterAndExport extends TestPoint {
  constructor(reportText: string, id: string) {
    super("TP-NEW-099", `Export report ${reportText} for ${id}`, async (page) => {
      const pom = new ReportsPage(page);
      const report = pom.page.getByText(reportText, { exact: false }).first();
      if (await report.isVisible().catch(() => false)) {
        await report.click();
      }
      const box = pom.page.getByRole("textbox").first();
      await box.fill(id);
      await pom.search.click();
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class ReportsAssertCoherence extends TestPoint {
  constructor(expected: string) {
    super("TP-NEW-100", `Assert report contains ${expected}`, async (page) => {
      const filePath = lastExportPath(page);
      if (!filePath) {
        throw new Error("No report export was downloaded earlier in this scenario");
      }
      const body = fs.readFileSync(filePath, "utf8");
      if (!body.includes(expected)) {
        throw new Error(`Report export does not contain '${expected}'`);
      }
    });
  }
}

export class AccountingJournalFilterPaymentDate extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-101", `Filter accounting journal by ${date}`, async (page) => {
      const pom = new AccountingJournalPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class AccountingJournalClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-102", "Click Search on the accounting journal", async (page) => {
      await new AccountingJournalPage(page).search.click();
    });
  }
}

export class AccountingJournalAssertEntry extends TestPoint {
  constructor(expected: string) {
    super("TP-NEW-103", `Assert journal entry ${expected}`, async (page) => {
      await assertAnyStatus(new AccountingJournalPage(page), expected);
    });
  }
}

export class AccountingJournalAssertNoEntry extends TestPoint {
  constructor(eventText: string) {
    super("TP-NEW-104", `Assert no journal entry for ${eventText}`, async (page) => {
      await assertTableOmits(new AccountingJournalPage(page), eventText, "Journal");
    });
  }
}

export class AccountingJournalApplyCombinedFilters extends TestPoint {
  constructor(channelType: string) {
    super("TP-NEW-105", `Apply accounting journal channel ${channelType}`, async (page) => {
      const pom = new AccountingJournalPage(page);
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
    });
  }
}

export class AccountingJournalClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-106", "Clear accounting journal filters", async (page) => {
      await clearFilters(new AccountingJournalPage(page));
    });
  }
}

export class AccountingJournalClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-107", "Export the accounting journal", async (page) => {
      const pom = new AccountingJournalPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class AccountingJournalAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-108", "Assert the journal export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new AccountingJournalPage(page));
    });
  }
}

export class UnaccountedEventsFilterEvent extends TestPoint {
  constructor(date: string, eventName: string, reason: string) {
    super("TP-NEW-109", `Filter unaccounted events ${eventName}`, async (page) => {
      const pom = new UnaccountedEventsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
      await pom.selectDropdownOption(pom.selectEvents, eventName);
      await pom.selectDropdownOption(pom.selectFailureReason, reason);
    });
  }
}

export class UnaccountedEventsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-110", "Click Search on unaccounted events", async (page) => {
      await new UnaccountedEventsPage(page).search.click();
    });
  }
}

export class UnaccountedEventsAssertReason extends TestPoint {
  constructor(reason: string) {
    super("TP-NEW-111", `Assert unaccounted reason ${reason}`, async (page) => {
      await new UnaccountedEventsPage(page).expectTableContains(reason);
    });
  }
}

export class UnaccountedEventsAssertAbsent extends TestPoint {
  constructor(eventText: string) {
    super("TP-NEW-112", `Assert unaccounted event is gone (${eventText})`, async (page) => {
      await assertTableOmits(new UnaccountedEventsPage(page), eventText, "Unaccounted events");
    });
  }
}

export class AccountingRulesSetActive extends TestPoint {
  constructor(ruleName: string, active: boolean) {
    super("TP-NEW-113", `${active ? "Activate" : "Deactivate"} rule ${ruleName}`, async (page) => {
      const pom = new AccountingRulesPage(page);
      const row = pom.page.getByRole("row").filter({ hasText: ruleName }).first();
      await expect(row).toBeVisible();
      const toggle = row.getByRole("switch").or(row.getByRole("checkbox")).first();
      const checked = await toggle.isChecked().catch(() => false);
      if (checked !== active) {
        await toggle.click();
      }
    });
  }
}

export class AccountingRulesSetSamePriority extends TestPoint {
  constructor(ruleA: string, ruleB: string, priority = "1") {
    super("TP-NEW-114", `Set ${ruleA} and ${ruleB} to priority ${priority}`, async (page) => {
      await new AccountingRulesPage(page).expectOnPage();
      await setRulePriority(page, ruleA, priority);
      await setRulePriority(page, ruleB, priority);
    });
  }
}

export class AccountingRulesSetImbalance extends TestPoint {
  constructor(ruleName: string, debitPercent: string, creditPercent: string) {
    super("TP-NEW-115", `Set ${ruleName} debit ${debitPercent} credit ${creditPercent}`, async (page) => {
      const pom = new AccountingRulesPage(page);
      const row = pom.page.getByRole("row").filter({ hasText: ruleName }).first();
      await row.getByRole("button").filter({ has: pom.page.locator(".pi-pencil") }).first().click();
      const debit = pom.page.getByLabel(/debit/i).or(pom.page.getByPlaceholder(/debit/i)).first();
      const credit = pom.page.getByLabel(/credit/i).or(pom.page.getByPlaceholder(/credit/i)).first();
      await debit.fill(debitPercent);
      await credit.fill(creditPercent);
      await pom.page.getByRole("button", { name: /save/i }).first().click();
    });
  }
}

export class AccountingSettingsReplayUnaccounted extends TestPoint {
  constructor() {
    super("TP-NEW-116", "Replay unaccounted events", async (page) => {
      const pom = new AccountingSettingsPage(page);
      await pom.replay.click();
      await confirmYes(pom);
    });
  }
}

export class PostToLedgerGenerate extends TestPoint {
  constructor() {
    super("TP-NEW-117", "Generate the GL export", async (page) => {
      const pom = new PostToLedgerPage(page);
      await clickNamed(pom, /generate/i);
      await expect(pom.page.getByText(/success/i).first()).toBeVisible({ timeout: 120_000 });
    });
  }
}

export class PostToLedgerAssertFile extends TestPoint {
  constructor() {
    super("TP-NEW-118", "Download the GL file and check its structure", async (page) => {
      const pom = new PostToLedgerPage(page);
      const download = pom.page.getByRole("link", { name: /download|\.txt|\.csv/i }).or(pom.page.locator(".pi-download").locator("xpath=ancestor::button[1]"));
      await downloadExport(pom, download.first());
      await assertLastExportHasLines(pom, 2);
    });
  }
}

export class GlDetailsAssertGroupHeader extends TestPoint {
  constructor(groupHeaderId: string) {
    super("TP-NEW-119", `Assert GL details for group header ${groupHeaderId}`, async (page) => {
      const pom = new GlDetailsPage(page);
      await assertText(pom, groupHeaderId);
      await pom.expectTableHasRows();
    });
  }
}

export class TrialBalanceCalculateClosedPeriod extends TestPoint {
  constructor() {
    super("TP-NEW-120", "Calculate the closed accounting period", async (page) => {
      await confirmAction(new TrialBalancePage(page), /calculate/i);
    });
  }
}

export class TrialBalanceAssertBalances extends TestPoint {
  constructor() {
    super("TP-NEW-121", "Assert trial balance rows", async (page) => {
      const pom = new TrialBalancePage(page);
      await pom.expectTableHasRows();
      const text = (await pom.tableRows().first().innerText()) || "";
      if (!/\d/.test(text)) {
        throw new Error(`Trial balance row has no amount: ${text}`);
      }
    });
  }
}

export class ImbalancedItemsAssertStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-122", `Assert imbalanced status ${status}`, async (page) => {
      await new ImbalancedItemsPage(page).expectTableContains(status);
    });
  }
}

export class AccountingPeriodAssertPostingDate extends TestPoint {
  constructor(expectedDate: string) {
    super("TP-NEW-123", `Assert posting date ${expectedDate}`, async (page) => {
      await assertColumn(new AccountingJournalPage(page), /posting|accounting date|gl date/i, expectedDate);
    });
  }
}

export function neededTestPointSamples(): TestPoint[] {
  return [
    new PrepareIngestionFixture("docs/test_files"),
    new FileDashboardAssertIngestionStatus("Accepted"),
    new FileDashboardAssertTotalTransactions(1),
    new FileDashboardFilterIngestionStatus("Accepted"),
    new FileDashboardFilterDatasource("Sale"),
    new FileDashboardClearFilters(),
    new FileDashboardClickExport(),
    new FileDashboardAssertExportContent(),
    new FileDashboardUploadRecoveryFile("docs/test_files"),
    new FileDashboardAssertRecoveryBadge(),
    new DbShiftCreationDate("sale", "1", "2025-01-01T00:00:00Z"),
    new FailedTransactionsFilterDateRange("01/01/2025 - 31/01/2025"),
    new FailedTransactionsApplyCombinedFilters("Direct", "Sale"),
    new FailedTransactionsClickSearch(),
    new FailedTransactionsClearFilters(),
    new FailedTransactionsClickExport(),
    new FailedTransactionsAssertExportContent(),
    new FailedTransactionsAssertRecordStatus("DUPLICATED"),
    new PendingItemsSelectDatasourceType("sale source"),
    new PendingItemsFilterDateRange("01/01/2025 - 31/01/2025"),
    new PendingItemsClickSearch(),
    new PendingItemsOpenTab("Pending"),
    new PendingItemsAssertListNotEmpty(),
    new PendingItemsDeleteFirstItem(),
    new PendingItemsAssertItemOnDeletedTab("1"),
    new PendingItemsAssertAccepted(),
    new PendingItemsAssertOnHold("Missing FOP"),
    new PendingItemsAssertExpired("1"),
    new PendingItemsApplyCombinedFilters("Direct"),
    new PendingItemsClearFilters(),
    new PendingItemsClickExport(),
    new PendingItemsAssertExportContent(),
    new TransactionSettingsSetExpirationThreshold("adyen", "1"),
    new PointOfSalesCreateOffice("OFFICE"),
    new GeneralSettingsReplayFailedTransactions(),
    new AssertTransactionAccepted(),
    new CashForecastFilterDateRange("01/01/2025 - 31/01/2025"),
    new CashForecastSelectCustomerAcquirer("adyen"),
    new CashForecastSelectCurrency("EUR"),
    new CashForecastRefresh(),
    new CashForecastAssertDiagram(),
    new AlertsFilterDateRange("01/01/2025 - 31/01/2025"),
    new AlertsApplyCombinedFilters("File", "Missing"),
    new AlertsClickSearch(),
    new AlertsClearFilters(),
    new AlertsClickExport(),
    new AlertsAssertExportContent(),
    new AlertsAssertMissingFile("file.csv"),
    new BankReconciliationClickTriggerNow(),
    new SecondaryMatchingClickTriggerNow(),
    new MatchingRulesSetStackPriority("Rule 2", "Rule 3"),
    new MatchedItemsFilterDateRange("01/01/2025 - 31/01/2025"),
    new MatchedItemsSelectReconciliation("Bank Reconciliation"),
    new MatchedItemsClickSearch(),
    new MatchedItemsAssertMoleculeStatus("Complete"),
    new MatchedItemsOpenMolecule(),
    new MatchedItemsAssertAtomsLinked("0.00"),
    new MatchedItemsUnmatch(),
    new MatchedItemsMarkComplete(),
    new MatchedItemsDetachAtom(),
    new MatchedItemsSealMolecule(),
    new MatchedItemsApplyCombinedFilters("Complete", "Accepted"),
    new MatchedItemsClearFilters(),
    new MatchedItemsClickExport(),
    new MatchedItemsAssertExportContent(),
    new MatchedItemsOpenAccountingPreview(),
    new MatchedItemsAssertClearingNeutralized(),
    new MatchedItemsAssertAtomsPending("1"),
    new ManualMatchingSelectMode("Settlement Reconciliation"),
    new ManualMatchingFilterDateRange("01/01/2025 - 31/01/2025"),
    new ManualMatchingSelectBankPair(),
    new ManualMatchingSelectSaleRefundPair(),
    new ManualMatchingSelectSettlementRefundDebitPair(),
    new ManualMatchingAssertMatchResult("Complete", "Accepted"),
    new SaleAuditTrackOpenTab("Sales"),
    new SaleAuditTrackAssertLifecycleEvents(),
    new SaleAuditTrackClickExport(),
    new SaleAuditTrackAssertExportContent(),
    new SaleAuditTrackOpenAccountingDetails(),
    new SaleAuditTrackOpenGroupHeader(),
    new SaleAuditTrackAssertAppliedRule("Rule_B"),
    new SaleAuditTrackAssertAccountingDate("SAME_DAY"),
    new SettlementAuditTrackOpenTab("Settlements"),
    new SettlementAuditTrackAssertLifecycleEvents(),
    new SettlementAuditTrackClickExport(),
    new SettlementAuditTrackAssertExportContent(),
    new PaymentOrderAuditTrackOpenDeleted(),
    new PaymentOrderAuditTrackAssertLifecycleEvents(),
    new PaymentOrderAuditTrackClickExport(),
    new PaymentOrderAuditTrackAssertExportContent(),
    new BankAuditTrackAssertLifecycleEvents(),
    new SecondaryMatchingAssertMolecule("PNR"),
    new ReconciliationAlertsFilterMolecule("1"),
    new ReconciliationAlertsAssign(),
    new ReconciliationAlertsAccept(),
    new ReconciliationAlertsDispute(),
    new ReconciliationAlertsResolve(),
    new ReconciliationAlertsAssertStatus("Accepted"),
    new ReportsFilterAndExport("Sale", "1"),
    new ReportsAssertCoherence("1"),
    new AccountingJournalFilterPaymentDate("01/01/2025 - 31/01/2025"),
    new AccountingJournalClickSearch(),
    new AccountingJournalAssertEntry("Accepted"),
    new AccountingJournalAssertNoEntry("fee"),
    new AccountingJournalApplyCombinedFilters("Direct"),
    new AccountingJournalClearFilters(),
    new AccountingJournalClickExport(),
    new AccountingJournalAssertExportContent(),
    new UnaccountedEventsFilterEvent("01/01/2025 - 31/01/2025", "Sale received", "No rule found"),
    new UnaccountedEventsClickSearch(),
    new UnaccountedEventsAssertReason("Rule overlap detected"),
    new UnaccountedEventsAssertAbsent("Sale received"),
    new AccountingRulesSetActive("Sale received", true),
    new AccountingRulesSetSamePriority("Rule A", "Rule B"),
    new AccountingRulesSetImbalance("Sale received", "50", "40"),
    new AccountingSettingsReplayUnaccounted(),
    new PostToLedgerGenerate(),
    new PostToLedgerAssertFile(),
    new GlDetailsAssertGroupHeader("1"),
    new TrialBalanceCalculateClosedPeriod(),
    new TrialBalanceAssertBalances(),
    new ImbalancedItemsAssertStatus("pending"),
    new AccountingPeriodAssertPostingDate("01/01/2025"),
  ];
}
