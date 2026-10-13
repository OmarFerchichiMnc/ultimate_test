import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenReconciliationAlertsPage, ReconciliationAlertsDispute, ReconciliationAlertsResolve, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("End-to-End", () => {
  test("E2E-05B Dispute and resolve a discrepancy", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenReconciliationAlertsPage(),
      new ReconciliationAlertsDispute(),
      new ReconciliationAlertsResolve(),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
