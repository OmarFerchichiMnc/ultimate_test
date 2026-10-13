import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, OpenAccountingJournalPage, AccountingJournalFilterPaymentDate, AccountingJournalClickSearch, AccountingJournalAssertEntry, SaleAuditTrackAssertAppliedRule } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Accounting", () => {
  test("ACC-02 Highest priority rule is applied", async ({ loggedInPage }) => {
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
      new OpenAccountingJournalPage(),
      new AccountingJournalFilterPaymentDate("01/01/2026 - 31/01/2026"),
      new AccountingJournalClickSearch(),
      new AccountingJournalAssertEntry("Accepted"),
      new SaleAuditTrackAssertAppliedRule("Rule_B"),
    ]);
  });
});
