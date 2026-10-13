import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenSettlementReconciliationSettingsPage, TriggerNow, MatchedItemsAssertMoleculeStatus, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, MatchedItemsSealMolecule, MatchedItemsAssertAtomsLinked, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-28 Settlement sealing with discrepancy", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.settlementPath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new ExecuteUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new WaitForFileInjection(),
      new OpenSettlementReconciliationSettingsPage(),
      new TriggerNow(),
      new MatchedItemsAssertMoleculeStatus("Pending"),
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
      new OpenSettlementReconciliationSettingsPage(),
      new TriggerNow(),
      new MatchedItemsSealMolecule(),
      new MatchedItemsAssertAtomsLinked("0.00"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
