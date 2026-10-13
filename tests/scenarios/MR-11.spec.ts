import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingFilterDateRange, ManualMatchingSelectSaleRefundPair, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-11 Manual secondary matching, sale and refund", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Sale vs Refund"),
      new ManualMatchingFilterDateRange("01/01/2026 - 31/01/2026"),
      new ManualMatchingSelectSaleRefundPair(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Accepted", "Accepted"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
