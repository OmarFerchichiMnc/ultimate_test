import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenFailedTransactionsPage, FailedTransactionsFilterDateRange, FailedTransactionsClickSearch, FailedTransactionsApplyCombinedFilters, FailedTransactionsClearFilters, FailedTransactionsClickExport, FailedTransactionsAssertExportContent } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-25 Failed transactions filters and export", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenFailedTransactionsPage(),
      new FailedTransactionsFilterDateRange("01/01/2026 - 31/01/2026"),
      new FailedTransactionsClickSearch(),
      new FailedTransactionsApplyCombinedFilters("INDIRECT", "Sale"),
      new FailedTransactionsClickSearch(),
      new FailedTransactionsClearFilters(),
      new FailedTransactionsClickExport(),
      new FailedTransactionsAssertExportContent(),
    ]);
  });
});
