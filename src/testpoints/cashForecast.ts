// TestPoints used by the scenario specs (cashForecast). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { CashForecastPage } from "../pages/cashForecast.page";
import { dropdownByLabel } from "../pages/scenarioSupport";

export class CashForecastFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-037", `Filter cash forecast by ${date}`, async (page) => {
      const pom = new CashForecastPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class CashForecastSelectCustomerAcquirer extends TestPoint {
  constructor(name: string) {
    super("TP-NEW-038", `Select cash forecast customer ${name}`, async (page) => {
      const pom = new CashForecastPage(page);
      await pom.selectDropdownOption(pom.selectCustomerAcquirer, name);
    });
  }
}

export class CashForecastSelectCurrency extends TestPoint {
  constructor(currency: string) {
    super("TP-NEW-039", `Select cash forecast currency ${currency}`, async (page) => {
      const pom = new CashForecastPage(page);
      await pom.selectDropdownOption(dropdownByLabel(pom, /currency/i), currency);
    });
  }
}

export class CashForecastRefresh extends TestPoint {
  constructor() {
    super("TP-NEW-040", "Refresh cash forecast KPIs", async (page) => {
      const pom = new CashForecastPage(page);
      const refresh = pom.page.getByRole("button", { name: /refresh/i });
      if (
        await refresh
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        await refresh.first().click();
        return;
      }
      await pom.search.click();
    });
  }
}

export class CashForecastAssertDiagram extends TestPoint {
  constructor() {
    super("TP-NEW-041", "Assert the cash forecast diagram is displayed", async (page) => {
      const pom = new CashForecastPage(page);
      await expect(pom.page.locator("canvas, svg, p-chart, .p-chart").first()).toBeVisible();
    });
  }
}
