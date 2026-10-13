import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPointOfSalesPage, PointOfSalesCreateOffice, OpenGeneralSettingsPage, GeneralSettingsReplayFailedTransactions, AssertTransactionAccepted } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-14 Manual resolution of ON HOLD", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPointOfSalesPage(),
      new PointOfSalesCreateOffice("OFFICE"),
      new OpenGeneralSettingsPage(),
      new GeneralSettingsReplayFailedTransactions(),
      new AssertTransactionAccepted("ON HOLD"),
    ]);
  });
});
