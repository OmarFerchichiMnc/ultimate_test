import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenAlertsPage, AlertsFilterDateRange, AlertsClickSearch, AlertsApplyCombinedFilters, AlertsClearFilters, AlertsClickExport, AlertsAssertExportContent } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-28 Alerts filters and export", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenAlertsPage(),
      new AlertsFilterDateRange("01/01/2026 - 31/01/2026"),
      new AlertsClickSearch(),
      new AlertsApplyCombinedFilters("File", "Missing"),
      new AlertsClickSearch(),
      new AlertsClearFilters(),
      new AlertsClickExport(),
      new AlertsAssertExportContent(),
    ]);
  });
});
