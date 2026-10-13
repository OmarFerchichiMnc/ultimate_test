import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, MatchedItemsSealMolecule, OpenAccountingJournalPage, AccountingJournalAssertEntry, OpenPostToLedgerPage, PostToLedgerGenerate, PostToLedgerAssertFile } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("End-to-End", () => {
  test("E2E-07 Bank reconciliation sealing", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.salePath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new MatchedItemsSealMolecule(),
      new OpenAccountingJournalPage(),
      new AccountingJournalAssertEntry("Accepted"),
      new OpenPostToLedgerPage(),
      new PostToLedgerGenerate(),
      new PostToLedgerAssertFile(),
    ]);
  });
});
