import fs from "fs";
import os from "os";
import path from "path";
import { test, expect, Page } from "@playwright/test";
import {
  AccountingJournalAssertNoEntry,
  DbShiftCreationDate,
  FileDashboardAssertExportContent,
  FileDashboardAssertIngestionStatus,
  FileDashboardAssertTotalTransactions,
  FileDashboardClickExport,
  MatchedItemsAssertMoleculeStatus,
  PendingItemsAssertOnHold,
  PendingItemsDeleteFirstItem,
  PrepareIngestionFixture,
  ReconciliationAlertsAccept,
  ReportsAssertCoherence,
  SaleAuditTrackOpenTab,
  UnaccountedEventsAssertAbsent,
} from "../../src/pages/neededTestPoints";

const origin = "http://adad.test";

async function mount(page: Page, route: string, body: string): Promise<void> {
  await page.route(`${origin}/**`, (request) =>
    request.fulfill({ contentType: "text/html", body: `<!doctype html><html><body>${body}</body></html>` }),
  );
  await page.goto(`${origin}${route}`);
}

function grid(headers: string[], rows: string[][]): string {
  const head = headers.map((name) => `<th>${name}</th>`).join("");
  const body = rows.map((cells) => `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function exportButton(content: string): string {
  return `<button class="GUiExportButton">Export</button>
    <script>
      document.querySelector(".GUiExportButton").addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([${JSON.stringify(content)}], { type: "text/csv" }));
        link.download = "export.csv";
        link.click();
      });
    </script>`;
}

test.describe("scenario TestPoints without a browser", () => {
  test("PrepareIngestionFixture accepts an existing fixture", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "adad-fixture-"));
    fs.writeFileSync(path.join(dir, "Sale_GLOBAL.csv"), "header\n");
    await expect(new PrepareIngestionFixture(dir).run({} as never)).resolves.toBeTruthy();
  });

  test("PrepareIngestionFixture rejects a missing path", async () => {
    const missing = path.join(os.tmpdir(), `adad-missing-${Date.now()}`);
    await expect(new PrepareIngestionFixture(missing).run({} as never)).rejects.toThrow("not found");
  });

  test("PrepareIngestionFixture rejects an empty directory", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "adad-empty-"));
    await expect(new PrepareIngestionFixture(dir).run({} as never)).rejects.toThrow("empty");
  });

  test("DbShiftCreationDate refuses tables outside the allow list before touching the database", async () => {
    const point = new DbShiftCreationDate("users" as never, "1", "2025-01-01T00:00:00Z");
    await expect(point.run({} as never)).rejects.toThrow("Unsupported creation-date table");
  });

  test("ReportsAssertCoherence fails when nothing was exported", async () => {
    await expect(new ReportsAssertCoherence("MOL-1").run({} as never)).rejects.toThrow("No report export");
  });
});

test.describe("scenario TestPoints on local pages", () => {
  test("FileDashboardAssertIngestionStatus reads the status column", async ({ page }) => {
    await mount(page, "/etl-files", grid(["File Name", "Status", "Total transactions"], [["Sale.csv", "Accepted", "10"]]));
    await new FileDashboardAssertIngestionStatus("Accepted").run(page);
    await expect(new FileDashboardAssertIngestionStatus("Rejected").run(page)).rejects.toThrow("got 'Accepted'");
  });

  test("FileDashboardAssertTotalTransactions compares the count", async ({ page }) => {
    await mount(page, "/etl-files", grid(["File Name", "Status", "Total transactions"], [["Sale.csv", "Accepted", "10"]]));
    await new FileDashboardAssertTotalTransactions(10).run(page);
    await expect(new FileDashboardAssertTotalTransactions(9).run(page)).rejects.toThrow("total 10 instead of 9");
  });

  test("FileDashboardAssertTotalTransactions reads the eligible breakdown", async ({ page }) => {
    await mount(
      page,
      "/etl-files",
      grid(["File Name", "Status", "Total transactions"], [["Sale.csv", "Accepted", "10 Eligible: 10 Not Eligible: 0"]]),
    );
    await new FileDashboardAssertTotalTransactions(10).run(page);
    await new FileDashboardAssertTotalTransactions(10, 10).run(page);
    await expect(new FileDashboardAssertTotalTransactions(10, 9).run(page)).rejects.toThrow("eligible 10 instead of 9");
    await expect(new FileDashboardAssertTotalTransactions(11).run(page)).rejects.toThrow("total 10 instead of 11");
  });

  test("export assertions use the file downloaded earlier on the same page", async ({ page }) => {
    await mount(
      page,
      "/etl-files",
      grid(["File Name", "Status"], [["Sale.csv", "Accepted"]]) + exportButton("File Name,Status\nSale.csv,Accepted\n"),
    );
    await expect(new FileDashboardAssertExportContent().run(page)).rejects.toThrow("No export");
    await new FileDashboardClickExport().run(page);
    await new FileDashboardAssertExportContent().run(page);
    await new ReportsAssertCoherence("Sale.csv").run(page);
    await expect(new ReportsAssertCoherence("Other.csv").run(page)).rejects.toThrow("does not contain");
  });

  test("an export that does not match the grid fails", async ({ page }) => {
    await mount(
      page,
      "/etl-files",
      grid(["File Name", "Status"], [["Sale.csv", "Accepted"]]) + exportButton("x,y\nz,w\n"),
    );
    await new FileDashboardClickExport().run(page);
    await expect(new FileDashboardAssertExportContent().run(page)).rejects.toThrow("does not contain the first grid row");
  });

  test("PendingItemsAssertOnHold needs both the status and the message", async ({ page }) => {
    await mount(page, "/pending-items", grid(["Id", "Status", "Error"], [["S1", "ON HOLD", "Missing FOP"]]));
    await new PendingItemsAssertOnHold("Missing FOP").run(page);
  });

  test("PendingItemsDeleteFirstItem clicks delete and confirms", async ({ page }) => {
    await mount(
      page,
      "/pending-items",
      `${grid(["Id", "Action"], [["S1", '<button onclick="document.getElementById(\'confirm\').hidden = false">Delete</button>']])}
       <div id="confirm" hidden><button onclick="document.querySelector('tbody tr').remove(); document.body.dataset.deleted = 'yes'">Yes</button></div>`,
    );
    await new PendingItemsDeleteFirstItem().run(page);
    await expect(page.locator("body")).toHaveAttribute("data-deleted", "yes");
  });

  test("MatchedItemsAssertMoleculeStatus accepts any listed status", async ({ page }) => {
    await mount(page, "/matched-items", grid(["Molecule", "Matching status"], [["M1", "Complete"]]));
    await new MatchedItemsAssertMoleculeStatus("Pending or Complete").run(page);
  });

  test("AccountingJournalAssertNoEntry fails when the event is listed", async ({ page }) => {
    await mount(page, "/accounting-journal", grid(["Event", "Status"], [["Miscellaneous fee received", "Accepted"]]));
    await new AccountingJournalAssertNoEntry("Sale received").run(page);
    await expect(new AccountingJournalAssertNoEntry("Miscellaneous fee").run(page)).rejects.toThrow("still lists");
  });

  test("UnaccountedEventsAssertAbsent fails when the event is still listed", async ({ page }) => {
    await mount(page, "/unaccounted-events", grid(["Event", "Reason"], [["Sale received", "No rule found"]]));
    await new UnaccountedEventsAssertAbsent("Settlement received").run(page);
    await expect(new UnaccountedEventsAssertAbsent("Sale received").run(page)).rejects.toThrow("still lists");
  });

  test("ReconciliationAlertsAccept clicks Accept and confirms", async ({ page }) => {
    await mount(
      page,
      "/reconciliation-alerts",
      `<button onclick="document.getElementById('confirm').hidden = false">Accept</button>
       <div id="confirm" hidden><button onclick="document.body.dataset.accepted = 'yes'">Yes</button></div>`,
    );
    await new ReconciliationAlertsAccept().run(page);
    await expect(page.locator("body")).toHaveAttribute("data-accepted", "yes");
  });

  test("SaleAuditTrackOpenTab clicks the requested tab", async ({ page }) => {
    await mount(
      page,
      "/audit-track/sale",
      `<button onclick="document.body.dataset.tab = 'sales'">Sales</button>
       <button onclick="document.body.dataset.tab = 'refunded'">Refunded Sales</button>`,
    );
    await new SaleAuditTrackOpenTab("Refunded Sales").run(page);
    await expect(page.locator("body")).toHaveAttribute("data-tab", "refunded");
  });
});
