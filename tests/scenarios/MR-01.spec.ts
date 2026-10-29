import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { GenerateScenarioFiles, scenarioDataset } from "../../src/generation";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, OpenSettlementReconciliationSettingsPage, TriggerNow, OpenMatchedItemsPage, MatchedItemsFilterDateRange, MatchedItemsClickSearch, MatchedItemsWaitForMatchedItem, MatchedItemsAssertMoleculeStatus, MatchedItemsOpenMolecule, MatchedItemsAssertAtomsLinked, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableHasDocument, SaleAuditTrackAssertLifecycleEvents, OpenSettlementAuditTrackPage, SettlementUIFilterDocumentNumber, SettlementUIClickSearchQuickFilter, SettlementUICheckIfSettlementTableHasDocument, SettlementAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-01 Basic 1:1 match, settlement reconciliation, mono-currency", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const data = scenarioDataset("MR-01", { strategy: "documentNumberAndFop" });
    await runTestPoints(loggedInPage, [
      new GenerateScenarioFiles(data),
      new PrepareIngestionFixture(data.dir),
      new BastionSsmForward(),
      new PrepareUpload(data.dir, config.adadPaths.sales, data.sale.fileName),
      new ExecuteUpload(data.dir, config.adadPaths.sales, data.sale.fileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(data.sale.fileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(data.sale.fileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(data.sale.count, data.sale.eligible),
      new BastionSsmForward(),
      new PrepareUpload(data.dir, config.adadPaths.settlement, data.settlement.fileName),
      new ExecuteUpload(data.dir, config.adadPaths.settlement, data.settlement.fileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(data.settlement.fileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(data.settlement.fileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(data.settlement.count, data.settlement.eligible),
      new OpenSettlementReconciliationSettingsPage(),
      new TriggerNow(),
      new OpenMatchedItemsPage(),
      new MatchedItemsFilterDateRange(data.paymentDateRange),
      new MatchedItemsClickSearch(),
      new MatchedItemsWaitForMatchedItem(`${data.currency} 0.00`),
      new MatchedItemsAssertMoleculeStatus("COMPLETE"),
      new MatchedItemsOpenMolecule(),
      new MatchedItemsAssertAtomsLinked("0.00"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber(data.documentNumber),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableHasDocument(data.documentNumber),
      new SaleAuditTrackAssertLifecycleEvents([]),
      new OpenSettlementAuditTrackPage(),
      new SettlementUIFilterDocumentNumber(data.documentNumber),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableHasDocument(data.documentNumber),
      new SettlementAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
