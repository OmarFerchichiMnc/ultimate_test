import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenAccountingJournalPage, AccountingJournalFilterPaymentDate, AccountingJournalClickSearch, AccountingJournalApplyCombinedFilters, AccountingJournalClearFilters, AccountingJournalClickExport, AccountingJournalAssertExportContent } from "../../src/pages";

test.describe("Accounting", () => {
  test("ACC-23 Accounting journal filters and export", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenAccountingJournalPage(),
      new AccountingJournalFilterPaymentDate("01/01/2026 - 31/01/2026"),
      new AccountingJournalClickSearch(),
      new AccountingJournalApplyCombinedFilters("INDIRECT"),
      new AccountingJournalClearFilters(),
      new AccountingJournalClickExport(),
      new AccountingJournalAssertExportContent(),
    ]);
  });
});
