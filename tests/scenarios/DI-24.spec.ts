import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenFileDashboardPage, FileDashboardUIFilterExpectedFileReceptionDate, FileDashboardUIFilterClickSearch, FileDashboardUIAddFilters, FileDashboardFilterIngestionStatus, FileDashboardFilterDatasource, FileDashboardClearFilters, FileDashboardClickExport, FileDashboardAssertExportContent } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-24 File Dashboard filters and export", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenFileDashboardPage(),
      new FileDashboardUIFilterExpectedFileReceptionDate("01/01/2026 - 31/01/2026"),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardUIAddFilters(),
      new FileDashboardFilterIngestionStatus("Accepted"),
      new FileDashboardFilterDatasource("Sale"),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardClearFilters(),
      new FileDashboardClickExport(),
      new FileDashboardAssertExportContent(),
    ]);
  });
});
