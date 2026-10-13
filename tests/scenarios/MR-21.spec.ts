import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingSelectBankPair, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-21 Manual match with a partial amount, bank reconciliation", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Bank Reconciliation"),
      new ManualMatchingSelectBankPair(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Pending", "Partial"),
    ]);
  });
});
