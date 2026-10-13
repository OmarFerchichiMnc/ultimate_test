import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { OpenAccountingRulesPage, AccountingRulesSetSamePriority, PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, OpenAccountingJournalPage, AccountingJournalAssertNoEntry, OpenUnaccountedEventsPage, UnaccountedEventsFilterEvent, UnaccountedEventsClickSearch, UnaccountedEventsAssertReason } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Accounting", () => {
  test("ACC-03 Rule priority conflict", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenAccountingRulesPage(),
      new AccountingRulesSetSamePriority("Rule A", "Rule B"),
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
      new OpenAccountingJournalPage(),
      new AccountingJournalAssertNoEntry("Sale received"),
      new OpenUnaccountedEventsPage(),
      new UnaccountedEventsFilterEvent("01/01/2026 - 31/01/2026", "Sale received", "No rule found"),
      new UnaccountedEventsClickSearch(),
      new UnaccountedEventsAssertReason("No rule found"),
    ]);
  });
});
