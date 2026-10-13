import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class SecondaryMatchingPage extends BasePage {
  static readonly path = "/secondary-matching";
  static testPoints(): TestPoint[] {
    return [
      new OpenSecondaryMatchingPage(),
      new InspectSecondaryMatchingMatchedSalesAndRefunds(),
      new InspectSecondaryMatchingDateRange(),
      new InspectSecondaryMatchingSelectReconciliationStatus(),
      new InspectSecondaryMatchingSearch(),
    ];
  }

  readonly matchedSalesAndRefunds: Locator;
  readonly dateRange: Locator;
  readonly selectReconciliationStatus: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, SecondaryMatchingPage.path);
    this.matchedSalesAndRefunds = this.findDropdown("Matched Sales and Refunds");
    this.dateRange = this.findCalendarTrigger();
    this.selectReconciliationStatus = this.findDropdown("Select Reconciliation Status");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenSecondaryMatchingPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SECONDARY_MATCHING", "Open /secondary-matching", async (page) => {
      const pom = new SecondaryMatchingPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSecondaryMatchingMatchedSalesAndRefunds extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SECONDARY_MATCHING-01",
      "Inspect (do not click) \"Matched Sales and Refunds\" on /secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingPage(page);
        await pom.expectVisible(pom.matchedSalesAndRefunds, "TP-BTN-SECONDARY_MATCHING-01 Matched Sales and Refunds on /secondary-matching");
        logger.info(`Skipping click for destructive control TP-BTN-SECONDARY_MATCHING-01: Matched Sales and Refunds`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectSecondaryMatchingDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SECONDARY_MATCHING-02",
      "Inspect \"pi pi-calendar\" on /secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-SECONDARY_MATCHING-02 pi pi-calendar on /secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingSelectReconciliationStatus extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SECONDARY_MATCHING-03",
      "Inspect \"Select Reconciliation Status\" on /secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingPage(page);
        await pom.expectVisible(pom.selectReconciliationStatus, "TP-BTN-SECONDARY_MATCHING-03 Select Reconciliation Status on /secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SECONDARY_MATCHING-04",
      "Inspect \"Search\" on /secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-SECONDARY_MATCHING-04 Search on /secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

