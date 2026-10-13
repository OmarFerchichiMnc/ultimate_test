import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenMatchedItemsPage, MatchedItemsOpenAccountingPreview, MatchedItemsUnmatch, AccountingJournalAssertEntry, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("Accounting", () => {
  test("ACC-18 Revert accounting after unmatching", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenMatchedItemsPage(),
      new MatchedItemsOpenAccountingPreview(),
      new MatchedItemsUnmatch(),
      new AccountingJournalAssertEntry("Accepted"),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
