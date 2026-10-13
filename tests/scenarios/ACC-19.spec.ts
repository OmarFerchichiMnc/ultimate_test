import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, OpenAccountingJournalPage, AccountingJournalAssertEntry, BankAuditTrackAssertLifecycleEvents, PaymentOrderAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Accounting", () => {
  test("ACC-19 Bank reconciliation accounting", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
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
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(config.files.saleFileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(config.files.saleFileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new OpenAccountingJournalPage(),
      new AccountingJournalAssertEntry("Accepted"),
      new BankAuditTrackAssertLifecycleEvents([]),
      new PaymentOrderAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
