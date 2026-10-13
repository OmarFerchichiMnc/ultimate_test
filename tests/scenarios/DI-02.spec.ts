import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenFileDashboardPage, FileDashboardUIFilterExpectedFileReceptionDate, FileDashboardUIFilterClickSearch, FileDashboardAssertIngestionStatus } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-02 Late file detection", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenFileDashboardPage(),
      new FileDashboardUIFilterExpectedFileReceptionDate("01/01/2026 - 31/01/2026"),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardAssertIngestionStatus("LATE"),
      new FileDashboardAssertIngestionStatus("MISSING"),
    ]);
  });
});
