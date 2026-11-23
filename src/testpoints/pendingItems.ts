// TestPoints used by the scenario specs (pendingItems). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { PendingItemsPage } from "../pages/pendingItems.page";
import {
  assertLastExportMatchesGrid,
  assertText,
  clearFilters,
  confirmYes,
  downloadExport,
  exportButton,
} from "../pages/scenarioSupport";

export class PendingItemsSelectDatasourceType extends TestPoint {
  constructor(datasource: string) {
    super("TP-NEW-019", `Select pending-items datasource ${datasource}`, async (page) => {
      const pom = new PendingItemsPage(page);
      const tab = pom.page.getByRole("button", { name: new RegExp(`^${datasource}$`, "i") });
      if (
        await tab
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        await tab.first().click();
        return;
      }
      await pom.selectDropdownOption(pom.saleSource, datasource);
    });
  }
}

export class PendingItemsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-020", `Filter pending items by ${date}`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class PendingItemsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-021", "Click Search on Pending Items", async (page) => {
      await new PendingItemsPage(page).search.click();
    });
  }
}

export class PendingItemsOpenTab extends TestPoint {
  constructor(tab: "Pending" | "Expired" | "Deleted") {
    super("TP-NEW-022", `Open pending items ${tab} tab`, async (page) => {
      const pom = new PendingItemsPage(page);
      const target = tab === "Pending" ? pom.pendingTab : tab === "Expired" ? pom.expiredTab : pom.deletedTab;
      await target.click();
    });
  }
}

export class PendingItemsAssertListNotEmpty extends TestPoint {
  constructor() {
    super("TP-NEW-023", "Assert pending items lists rows with Delete", async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.expectTableHasRows();
      const remove = pom
        .tableRows()
        .first()
        .locator("button")
        .filter({ has: pom.page.locator(".pi-trash") });
      const named = pom
        .tableRows()
        .first()
        .getByRole("button", { name: /delete/i });
      await expect(remove.or(named).first()).toBeVisible();
    });
  }
}

export class PendingItemsDeleteFirstItem extends TestPoint {
  constructor() {
    super("TP-NEW-024", "Delete the first pending item", async (page) => {
      const pom = new PendingItemsPage(page);
      const row = pom.tableRows().first();
      const remove = row.locator("button").filter({ has: pom.page.locator(".pi-trash") });
      const named = row.getByRole("button", { name: /delete/i });
      await remove.or(named).first().click();
      await confirmYes(pom);
    });
  }
}

export class PendingItemsAssertItemOnDeletedTab extends TestPoint {
  constructor(itemText: string) {
    super("TP-NEW-025", `Assert deleted item ${itemText}`, async (page) => {
      await new PendingItemsPage(page).expectTableContains(itemText);
    });
  }
}

export class PendingItemsAssertAccepted extends TestPoint {
  constructor(itemText = "Accepted") {
    super("TP-NEW-026", `Assert pending item is accepted (${itemText})`, async (page) => {
      await new PendingItemsPage(page).expectTableContains(itemText);
    });
  }
}

export class PendingItemsAssertOnHold extends TestPoint {
  constructor(message: string) {
    super("TP-NEW-027", `Assert ON HOLD: ${message}`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.expectTableContains("ON HOLD");
      await assertText(pom, message);
    });
  }
}

export class PendingItemsAssertExpired extends TestPoint {
  constructor(itemText: string) {
    super("TP-NEW-028", `Assert expired item ${itemText}`, async (page) => {
      await new PendingItemsPage(page).expectTableContains(itemText);
    });
  }
}

export class PendingItemsApplyCombinedFilters extends TestPoint {
  constructor(channelType: string) {
    super("TP-NEW-029", `Apply pending-items channel filter ${channelType}`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
    });
  }
}

export class PendingItemsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-030", "Clear Pending Items filters", async (page) => {
      await clearFilters(new PendingItemsPage(page));
    });
  }
}

export class PendingItemsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-031", "Export pending items", async (page) => {
      const pom = new PendingItemsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class PendingItemsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-032", "Assert the pending-items export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new PendingItemsPage(page));
    });
  }
}
