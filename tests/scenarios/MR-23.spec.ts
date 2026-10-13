import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingSelectSettlementRefundDebitPair, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-23 Manual match with a partial amount, settlement and refund debit", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Settlement vs Refund Debit"),
      new ManualMatchingSelectSettlementRefundDebitPair(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Pending", "Partial"),
    ]);
  });
});
