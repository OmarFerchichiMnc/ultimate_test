import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class PendingItemsPage extends BasePage {
  static readonly path = "/pending-items";
  static testPoints(): TestPoint[] {
    return [
      new OpenPendingItemsPage(),
      new InspectPendingItemsSaleSource(),
      new InspectPendingItemsSearch(),
      new InspectPendingItemsDateRange(),
      new InspectPendingItemsSelectAChannelType(),
      new InspectPendingItemsExtraFiltersButton(),
      new InspectPendingItemsSearchAdvanced(),
      new InspectPendingItemsPendingTab(),
      new InspectPendingItemsExpiredTab(),
      new InspectPendingItemsDeletedTab(),
    ];
  }

  readonly saleSource: Locator;
  readonly search: Locator;
  readonly dateRange: Locator;
  readonly selectAChannelType: Locator;
  readonly extraFiltersButton: Locator;
  readonly searchAdvanced: Locator;
  readonly pendingTab: Locator;
  readonly expiredTab: Locator;
  readonly deletedTab: Locator;

  constructor(page: Page) {
    super(page, PendingItemsPage.path);
    this.saleSource = this.findDropdown("Sale Source");
    this.search = this.findNamedButton("Search", 0);
    this.dateRange = this.findCalendarTrigger();
    this.selectAChannelType = this.findDropdown("Select a channel type");
    this.extraFiltersButton = this.findExtraFilters();
    this.searchAdvanced = this.findNamedButton("Search", 1);
    this.pendingTab = this.findTab("Pending");
    this.expiredTab = this.findTab("Expired");
    this.deletedTab = this.findTab("Deleted");
  }
}

export class OpenPendingItemsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-PENDING_ITEMS", "Open /pending-items", async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectPendingItemsSaleSource extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-01",
      "Inspect \"Sale Source\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.saleSource, "TP-BTN-PENDING_ITEMS-01 Sale Source on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-02",
      "Inspect \"Search\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-PENDING_ITEMS-02 Search on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-03",
      "Inspect \"pi pi-calendar\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-PENDING_ITEMS-03 pi pi-calendar on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsSelectAChannelType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-04",
      "Inspect \"Select a channel type\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.selectAChannelType, "TP-BTN-PENDING_ITEMS-04 Select a channel type on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-05",
      "Inspect \"pi pi-filter\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-PENDING_ITEMS-05 pi pi-filter on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsSearchAdvanced extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-06",
      "Inspect \"Search\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.searchAdvanced, "TP-BTN-PENDING_ITEMS-06 Search on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsPendingTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-07",
      "Inspect \"Pending\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.pendingTab, "TP-BTN-PENDING_ITEMS-07 Pending on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsExpiredTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-08",
      "Inspect \"Expired\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.expiredTab, "TP-BTN-PENDING_ITEMS-08 Expired on /pending-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPendingItemsDeletedTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PENDING_ITEMS-09",
      "Inspect (do not click) \"Deleted\" on /pending-items",
      async (page) => {
        const pom = new PendingItemsPage(page);
        await pom.expectVisible(pom.deletedTab, "TP-BTN-PENDING_ITEMS-09 Deleted on /pending-items");
        logger.info(`Skipping click for destructive control TP-BTN-PENDING_ITEMS-09: Deleted`);
      },
      "*****",
      "inspect-only",
    );
  }
}

