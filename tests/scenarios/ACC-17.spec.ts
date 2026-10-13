import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { OpenAccountingRulesPage, AccountingRulesSetImbalance, PrepareIngestionFixture, OpenImbalancedItemsPage, ImbalancedItemsAssertStatus, AccountingSettingsReplayUnaccounted } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Accounting", () => {
  test("ACC-17 Imbalanced journal entries and replay", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenAccountingRulesPage(),
      new AccountingRulesSetImbalance("Sale received", "50", "40"),
      new PrepareIngestionFixture(config.files.salePath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenImbalancedItemsPage(),
      new ImbalancedItemsAssertStatus("Pending"),
      new AccountingRulesSetImbalance("Sale received", "50", "40"),
      new AccountingSettingsReplayUnaccounted(),
      new ImbalancedItemsAssertStatus("Accepted"),
    ]);
  });
});
