import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class ProvisionalMismatchedItemsPage extends BasePage {
  static readonly path = "/provisional-mismatched-items";
  static testPoints(): TestPoint[] {
    return [
      new OpenProvisionalMismatchedItemsPage(),
      new InspectProvisionalMismatchedItemsDateRange(),
      new InspectProvisionalMismatchedItemsAdyen(),
      new InspectProvisionalMismatchedItemsExtraFiltersButton(),
      new InspectProvisionalMismatchedItemsSearch(),
      new InspectProvisionalMismatchedItemsProvisionalTab(),
      new InspectProvisionalMismatchedItemsConfirmedTab(),
    ];
  }

  readonly dateRange: Locator;
  readonly adyen: Locator;
  readonly extraFiltersButton: Locator;
  readonly search: Locator;
  readonly provisionalTab: Locator;
  readonly confirmedTab: Locator;

  constructor(page: Page) {
    super(page, ProvisionalMismatchedItemsPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.adyen = this.findDropdown("adyen");
    this.extraFiltersButton = this.findExtraFilters();
    this.search = this.findNamedButton("Search", 0);
    this.provisionalTab = this.findTab("Provisional");
    this.confirmedTab = this.findTab("Confirmed");
  }
}

export class OpenProvisionalMismatchedItemsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-PROVISIONAL_MISMATCHED_ITEMS", "Open /provisional-mismatched-items", async (page) => {
      const pom = new ProvisionalMismatchedItemsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectProvisionalMismatchedItemsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-01",
      "Inspect \"pi pi-calendar\" on /provisional-mismatched-items",
      async (page) => {
        const pom = new ProvisionalMismatchedItemsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-01 pi pi-calendar on /provisional-mismatched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectProvisionalMismatchedItemsAdyen extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-02",
      "Inspect \"adyen\" on /provisional-mismatched-items",
      async (page) => {
        const pom = new ProvisionalMismatchedItemsPage(page);
        await pom.expectVisible(pom.adyen, "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-02 adyen on /provisional-mismatched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectProvisionalMismatchedItemsExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-03",
      "Inspect \"pi pi-filter\" on /provisional-mismatched-items",
      async (page) => {
        const pom = new ProvisionalMismatchedItemsPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-03 pi pi-filter on /provisional-mismatched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectProvisionalMismatchedItemsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-04",
      "Inspect \"Search\" on /provisional-mismatched-items",
      async (page) => {
        const pom = new ProvisionalMismatchedItemsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-04 Search on /provisional-mismatched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectProvisionalMismatchedItemsProvisionalTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-05",
      "Inspect \"Provisional\" on /provisional-mismatched-items",
      async (page) => {
        const pom = new ProvisionalMismatchedItemsPage(page);
        await pom.expectVisible(pom.provisionalTab, "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-05 Provisional on /provisional-mismatched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectProvisionalMismatchedItemsConfirmedTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-06",
      "Inspect (do not click) \"Confirmed\" on /provisional-mismatched-items",
      async (page) => {
        const pom = new ProvisionalMismatchedItemsPage(page);
        await pom.expectVisible(pom.confirmedTab, "TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-06 Confirmed on /provisional-mismatched-items");
        logger.info(`Skipping click for destructive control TP-BTN-PROVISIONAL_MISMATCHED_ITEMS-06: Confirmed`);
      },
      "*****",
      "inspect-only",
    );
  }
}

