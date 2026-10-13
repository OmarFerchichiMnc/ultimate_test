import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardUploadRecoveryFile, FileDashboardUIFilterClickSearch, FileDashboardAssertRecoveryBadge } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-15 Recovery of a missing file", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.salePath),
      new OpenFileDashboardPage(),
      new FileDashboardUploadRecoveryFile(config.files.salePath),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardAssertRecoveryBadge(),
    ]);
  });
});
