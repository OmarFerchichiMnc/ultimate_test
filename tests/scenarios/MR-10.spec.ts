import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingFilterDateRange, ManualMatchingSelectBankPair, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult, OpenPaymentOrderAuditTrackPage, PaymentOrderAuditTrackAssertLifecycleEvents, OpenBankAuditTrackPage, BankAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-10 Manual matching, bank reconciliation", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Bank Reconciliation"),
      new ManualMatchingFilterDateRange("01/01/2026 - 31/01/2026"),
      new ManualMatchingSelectBankPair(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Accepted", "Accepted"),
      new OpenPaymentOrderAuditTrackPage(),
      new PaymentOrderAuditTrackAssertLifecycleEvents([]),
      new OpenBankAuditTrackPage(),
      new BankAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
