import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPendingItemsPage, PendingItemsOpenTab, OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingFilterDateRange, ManualMatchingUISaleClickCheckBox, ManualMatchingUISettlementClickCheckBox, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlement, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-25 Match an expired item", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPendingItemsPage(),
      new PendingItemsOpenTab("Expired"),
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Settlement Reconciliation"),
      new ManualMatchingFilterDateRange("01/01/2026 - 31/01/2026"),
      new ManualMatchingUISaleClickCheckBox(),
      new ManualMatchingUISettlementClickCheckBox(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlement(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Complete", "Accepted"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
