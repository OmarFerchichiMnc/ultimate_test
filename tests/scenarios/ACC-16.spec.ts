import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { OpenAccountingRulesPage, AccountingRulesSetActive, PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, OpenUnaccountedEventsPage, UnaccountedEventsAssertReason, OpenAccountingSettingsPage, AccountingSettingsReplayUnaccounted, AccountingJournalAssertEntry, UnaccountedEventsAssertAbsent } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Accounting", () => {
  test("ACC-16 Replay unaccounted events", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenAccountingRulesPage(),
      new AccountingRulesSetActive("Sale received", true),
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
      new OpenUnaccountedEventsPage(),
      new UnaccountedEventsAssertReason("No rule found"),
      new AccountingRulesSetActive("Sale received", true),
      new OpenAccountingSettingsPage(),
      new AccountingSettingsReplayUnaccounted(),
      new AccountingJournalAssertEntry("Accepted"),
      new UnaccountedEventsAssertAbsent("Sale received"),
    ]);
  });
});
