import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenMatchedItemsPage, MatchedItemsFilterDateRange, MatchedItemsClickSearch, MatchedItemsOpenMolecule, MatchedItemsOpenAccountingPreview, MatchedItemsAssertClearingNeutralized } from "../../src/pages";

test.describe("Accounting", () => {
  test("ACC-10 Reconciliation accounting entry", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenMatchedItemsPage(),
      new MatchedItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new MatchedItemsClickSearch(),
      new MatchedItemsOpenMolecule(),
      new MatchedItemsOpenAccountingPreview(),
      new MatchedItemsAssertClearingNeutralized(),
    ]);
  });
});
