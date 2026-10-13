import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class CashForecastPage extends BasePage {
  static readonly path = "/dashboard/cash-forecast";
  static testPoints(): TestPoint[] {
    return [
      new OpenCashForecastPage(),
      new InspectCashForecastDateRange(),
      new InspectCashForecastSelectCustomerAcquirer(),
      new InspectCashForecastSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectCustomerAcquirer: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, CashForecastPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectCustomerAcquirer = this.findDropdown("Select Customer/Acquirer");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenCashForecastPage extends TestPoint {
  constructor() {
    super("TP-OPEN-DASHBOARD_CASH_FORECAST", "Open /dashboard/cash-forecast", async (page) => {
      const pom = new CashForecastPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectCashForecastDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-DASHBOARD_CASH_FORECAST-01",
      "Inspect \"pi pi-calendar\" on /dashboard/cash-forecast",
      async (page) => {
        const pom = new CashForecastPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-DASHBOARD_CASH_FORECAST-01 pi pi-calendar on /dashboard/cash-forecast");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectCashForecastSelectCustomerAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-DASHBOARD_CASH_FORECAST-02",
      "Inspect \"Select Customer/Acquirer\" on /dashboard/cash-forecast",
      async (page) => {
        const pom = new CashForecastPage(page);
        await pom.expectVisible(pom.selectCustomerAcquirer, "TP-BTN-DASHBOARD_CASH_FORECAST-02 Select Customer/Acquirer on /dashboard/cash-forecast");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectCashForecastSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-DASHBOARD_CASH_FORECAST-03",
      "Inspect \"Search\" on /dashboard/cash-forecast",
      async (page) => {
        const pom = new CashForecastPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-DASHBOARD_CASH_FORECAST-03 Search on /dashboard/cash-forecast");
      },
      "*****",
      "ready",
    );
  }
}

