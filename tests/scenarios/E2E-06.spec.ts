import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenSettlementReconciliationSettingsPage, TriggerNow, MatchedItemsAssertAtomsLinked, MatchedItemsSealMolecule, OpenAccountingJournalPage, AccountingJournalAssertEntry, OpenPostToLedgerPage, PostToLedgerGenerate, PostToLedgerAssertFile } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("End-to-End", () => {
  test("E2E-06 Settlement reconciliation sealing", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.settlementPath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new ExecuteUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new WaitForFileInjection(),
      new OpenSettlementReconciliationSettingsPage(),
      new TriggerNow(),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenSettlementReconciliationSettingsPage(),
      new TriggerNow(),
      new MatchedItemsAssertAtomsLinked("0.00"),
      new MatchedItemsSealMolecule(),
      new OpenAccountingJournalPage(),
      new AccountingJournalAssertEntry("Accepted"),
      new OpenPostToLedgerPage(),
      new PostToLedgerGenerate(),
      new PostToLedgerAssertFile(),
    ]);
  });
});
