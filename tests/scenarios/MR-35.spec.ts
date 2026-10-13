import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, OpenReconciliationAlertsPage, ReconciliationAlertsFilterMolecule, ReconciliationAlertsAssign, ReconciliationAlertsResolve, PaymentOrderAuditTrackAssertLifecycleEvents, ReportsFilterAndExport, ReportsAssertCoherence } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-35 Resolve a bank discrepancy", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.salePath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new OpenReconciliationAlertsPage(),
      new ReconciliationAlertsFilterMolecule("1"),
      new ReconciliationAlertsAssign(),
      new ReconciliationAlertsResolve(),
      new PaymentOrderAuditTrackAssertLifecycleEvents([]),
      new ReportsFilterAndExport("Sale", "1"),
      new ReportsAssertCoherence("1"),
    ]);
  });
});
