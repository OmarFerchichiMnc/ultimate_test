import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFailedTransactionsPage, FailedTransactionsFilterDateRange, FailedTransactionsClickSearch, FailedTransactionsAssertRecordStatus } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Data Ingestion", () => {
  test("DI-08 Duplicate transaction", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.salePath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenFailedTransactionsPage(),
      new FailedTransactionsFilterDateRange("01/01/2026 - 31/01/2026"),
      new FailedTransactionsClickSearch(),
      new FailedTransactionsAssertRecordStatus("DUPLICATED"),
    ]);
  });
});
