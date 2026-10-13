import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, MatchedItemsAssertMoleculeStatus, PaymentOrderAuditTrackAssertLifecycleEvents, BankAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("End-to-End", () => {
  test("E2E-05 Bank reconciliation", async ({ loggedInPage }) => {
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
      new MatchedItemsAssertMoleculeStatus("Accepted"),
      new PaymentOrderAuditTrackAssertLifecycleEvents([]),
      new BankAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
