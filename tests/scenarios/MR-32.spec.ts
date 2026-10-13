import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, OpenSettlementReconciliationSettingsPage, TriggerNow, OpenReconciliationAlertsPage, ReconciliationAlertsFilterMolecule, ReconciliationAlertsAssertStatus, ReconciliationAlertsAssign, ReconciliationAlertsAccept, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents, OpenSettlementAuditTrackPage, SettlementUIFilterDocumentNumber, SettlementUIClickSearchQuickFilter, SettlementUICheckIfSettlementTableNotEmpty, SettlementAuditTrackAssertLifecycleEvents, ReportsFilterAndExport, ReportsAssertCoherence } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-32 Accept a settlement discrepancy", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.settlementPath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(config.files.saleFileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(config.files.saleFileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(20),
      new BastionSsmForward(),
      new PrepareUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new ExecuteUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(config.files.settlementFileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(config.files.settlementFileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(20),
      new OpenSettlementReconciliationSettingsPage(),
      new TriggerNow(),
      new OpenReconciliationAlertsPage(),
      new ReconciliationAlertsFilterMolecule("1"),
      new ReconciliationAlertsAssertStatus("Accepted"),
      new ReconciliationAlertsAssign(),
      new ReconciliationAlertsAccept(),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
      new OpenSettlementAuditTrackPage(),
      new SettlementUIFilterDocumentNumber("2129690954587"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementAuditTrackAssertLifecycleEvents([]),
      new ReportsFilterAndExport("Sale", "1"),
      new ReportsAssertCoherence("1"),
      new ReportsFilterAndExport("Sale", "1"),
      new ReportsAssertCoherence("1"),
      new ReportsFilterAndExport("Sale", "1"),
      new ReportsAssertCoherence("1"),
    ]);
  });
});
