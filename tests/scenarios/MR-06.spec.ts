import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, DbShiftCreationDate, OpenSecondaryMatchingSettingsPage, SecondaryMatchingClickTriggerNow, OpenSecondaryMatchingPage, SecondaryMatchingAssertMolecule, OpenSettlementAuditTrackPage, SettlementUIFilterDocumentNumber, SettlementUIClickSearchQuickFilter, SettlementUICheckIfSettlementTableNotEmpty, SettlementAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-06 Secondary matching: settlement and refund debit", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.settlementPath),
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
      new DbShiftCreationDate("settlement", "1", "2026-01-16T00:00:00Z"),
      new OpenSecondaryMatchingSettingsPage(),
      new SecondaryMatchingClickTriggerNow(),
      new OpenSecondaryMatchingPage(),
      new SecondaryMatchingAssertMolecule("Q8E3G2"),
      new OpenSettlementAuditTrackPage(),
      new SettlementUIFilterDocumentNumber("2129690954587"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
