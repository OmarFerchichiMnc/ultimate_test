import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPendingItemsPage, PendingItemsSelectDatasourceType, PendingItemsOpenTab, PendingItemsFilterDateRange, PendingItemsClickSearch, PendingItemsAssertListNotEmpty, PendingItemsDeleteFirstItem, PendingItemsAssertItemOnDeletedTab } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-17 Pending items deletion: sale source", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPendingItemsPage(),
      new PendingItemsSelectDatasourceType("Sale"),
      new PendingItemsOpenTab("Pending"),
      new PendingItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new PendingItemsClickSearch(),
      new PendingItemsAssertListNotEmpty(),
      new PendingItemsDeleteFirstItem(),
      new PendingItemsOpenTab("Deleted"),
      new PendingItemsAssertItemOnDeletedTab("2129690954587"),
    ]);
  });
});
