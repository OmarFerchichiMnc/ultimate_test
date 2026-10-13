import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPendingItemsPage, PendingItemsFilterDateRange, PendingItemsClickSearch, PendingItemsApplyCombinedFilters, PendingItemsClearFilters, PendingItemsClickExport, PendingItemsAssertExportContent } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-26 Pending items filters and export", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPendingItemsPage(),
      new PendingItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new PendingItemsClickSearch(),
      new PendingItemsApplyCombinedFilters("INDIRECT"),
      new PendingItemsClickSearch(),
      new PendingItemsClearFilters(),
      new PendingItemsClickExport(),
      new PendingItemsAssertExportContent(),
    ]);
  });
});
