import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { OpenSecondaryMatchingRulesPage, MatchingRulesSetStackPriority, PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, OpenSecondaryMatchingSettingsPage, SecondaryMatchingClickTriggerNow, MatchedItemsAssertMoleculeStatus, MatchedItemsAssertAtomsLinked, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-15 Matching stack priority, secondary matching", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenSecondaryMatchingRulesPage(),
      new MatchingRulesSetStackPriority("Rule 2", "Rule 3"),
      new PrepareIngestionFixture(config.files.salePath),
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
      new OpenSecondaryMatchingSettingsPage(),
      new SecondaryMatchingClickTriggerNow(),
      new MatchedItemsAssertMoleculeStatus("Accepted"),
      new MatchedItemsAssertAtomsLinked("0.00"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
