import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenMatchedItemsPage, MatchedItemsFilterDateRange, MatchedItemsClickSearch, MatchedItemsApplyCombinedFilters, MatchedItemsClearFilters, MatchedItemsClickExport, MatchedItemsAssertExportContent } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-27 Matched items filters and export", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenMatchedItemsPage(),
      new MatchedItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new MatchedItemsClickSearch(),
      new MatchedItemsApplyCombinedFilters("Complete", "Accepted"),
      new MatchedItemsClickSearch(),
      new MatchedItemsClearFilters(),
      new MatchedItemsClickExport(),
      new MatchedItemsAssertExportContent(),
    ]);
  });
});
