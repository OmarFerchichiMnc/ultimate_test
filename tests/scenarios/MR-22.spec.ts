import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingSelectSaleRefundPair, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-22 Manual match with a partial amount, sale and refund", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Sale vs Refund"),
      new ManualMatchingSelectSaleRefundPair(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Pending", "Partial"),
    ]);
  });
});
