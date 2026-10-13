import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { OpenTransactionSettingsPage, TransactionSettingsSetExpirationThreshold, PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, OpenPendingItemsPage, PendingItemsSelectDatasourceType, PendingItemsOpenTab, PendingItemsFilterDateRange, PendingItemsClickSearch, PendingItemsAssertExpired } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Data Ingestion", () => {
  test("DI-16 Settlement expiration threshold", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenTransactionSettingsPage(),
      new TransactionSettingsSetExpirationThreshold("adyen", "1"),
      new PrepareIngestionFixture(config.files.settlementPath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new ExecuteUpload(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(config.files.saleFileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(config.files.saleFileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(20),
      new OpenPendingItemsPage(),
      new PendingItemsSelectDatasourceType("Sale"),
      new PendingItemsOpenTab("Expired"),
      new PendingItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new PendingItemsClickSearch(),
      new PendingItemsAssertExpired("2129690954587"),
    ]);
  });
});
