import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenReconciliationAlertsPage, ReconciliationAlertsAccept, MatchedItemsAssertMoleculeStatus, OpenAccountingJournalPage, AccountingJournalAssertEntry, OpenPostToLedgerPage, PostToLedgerGenerate, PostToLedgerAssertFile } from "../../src/pages";

test.describe("End-to-End", () => {
  test("E2E-05A Accept a discrepancy", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenReconciliationAlertsPage(),
      new ReconciliationAlertsAccept(),
      new MatchedItemsAssertMoleculeStatus("Complete"),
      new OpenAccountingJournalPage(),
      new AccountingJournalAssertEntry("Accepted"),
      new OpenPostToLedgerPage(),
      new PostToLedgerGenerate(),
      new PostToLedgerAssertFile(),
    ]);
  });
});
