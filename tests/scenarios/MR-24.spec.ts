import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenMatchedItemsPage, MatchedItemsFilterDateRange, MatchedItemsClickSearch, MatchedItemsUnmatch, MatchedItemsAssertAtomsPending, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-24 Unmatch an incorrect pair", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenMatchedItemsPage(),
      new MatchedItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new MatchedItemsClickSearch(),
      new MatchedItemsUnmatch(),
      new MatchedItemsAssertAtomsPending("2129690954587"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
