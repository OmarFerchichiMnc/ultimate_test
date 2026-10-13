import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class ReportsPage extends BasePage {
  static readonly path = "/reports";
  static testPoints(): TestPoint[] {
    return [
      new OpenReportsPage(),
      new InspectReportsDateRange(),
      new InspectReportsSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, ReportsPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenReportsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-REPORTS", "Open /reports", async (page) => {
      const pom = new ReportsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectReportsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-REPORTS-01",
      "Inspect \"pi pi-calendar\" on /reports",
      async (page) => {
        const pom = new ReportsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-REPORTS-01 pi pi-calendar on /reports");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectReportsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-REPORTS-02",
      "Inspect \"Search\" on /reports",
      async (page) => {
        const pom = new ReportsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-REPORTS-02 Search on /reports");
      },
      "*****",
      "ready",
    );
  }
}

