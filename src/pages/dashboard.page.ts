import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class DashboardPage extends BasePage {
  static readonly path = "/dashboard";
  static testPoints(): TestPoint[] {
    return [
      new OpenDashboardPage(),
      new InspectDashboardDateRange(),
      new InspectDashboardDownload(),
    ];
  }

  readonly dateRange: Locator;
  readonly download: Locator;
  readonly dateRangeInput: Locator;

  constructor(page: Page) {
    super(page, DashboardPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.download = this.findIconButton("pi-download");
    this.dateRangeInput = this.page.locator("adad-frontend-date-range").getByRole("textbox");
  }
}

export class OpenDashboardPage extends TestPoint {
  constructor() {
    super("TP-OPEN-DASHBOARD", "Open /dashboard", async (page) => {
      const pom = new DashboardPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectDashboardDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-DASHBOARD-01",
      "Inspect \"pi pi-calendar\" on /dashboard",
      async (page) => {
        const pom = new DashboardPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-DASHBOARD-01 pi pi-calendar on /dashboard");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectDashboardDownload extends TestPoint {
  constructor() {
    super(
      "TP-BTN-DASHBOARD-02",
      "Inspect \"pi pi-download\" on /dashboard",
      async (page) => {
        const pom = new DashboardPage(page);
        await pom.expectVisible(pom.download, "TP-BTN-DASHBOARD-02 pi pi-download on /dashboard");
      },
      "*****",
      "ready",
    );
  }
}

export class DashboardUISaleFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP0100", "Filter date range within dashboard page", async (page) => {
      const pom = new DashboardPage(page);
      await pom.expectOnPage();
      await pom.dateRange.click();
      await pom.fillDateRange(pom.dateRangeInput, date);
    });
  }
}
