import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { OpenDashboardPage, DashboardUISaleFilterDateRange, FileDashboardAssertIngestionStatus, OpenAlertsPage, AlertsFilterDateRange, AlertsApplyCombinedFilters, AlertsClickSearch, AlertsAssertMissingFile } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-03 Missing file alert", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenDashboardPage(),
      new DashboardUISaleFilterDateRange("01/01/2026 - 31/01/2026"),
      new FileDashboardAssertIngestionStatus("MISSING"),
      new OpenAlertsPage(),
      new AlertsFilterDateRange("01/01/2026 - 31/01/2026"),
      new AlertsApplyCombinedFilters("File", "Missing"),
      new AlertsClickSearch(),
      new AlertsAssertMissingFile(config.files.saleFileName),
    ]);
  });
});
