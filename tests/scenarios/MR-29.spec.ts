import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, MatchedItemsAssertMoleculeStatus, MatchedItemsSealMolecule, MatchedItemsAssertAtomsLinked, BankAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-29 Bank sealing with discrepancy", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.salePath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new MatchedItemsAssertMoleculeStatus("Pending"),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new MatchedItemsSealMolecule(),
      new MatchedItemsAssertAtomsLinked("0.00"),
      new BankAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
