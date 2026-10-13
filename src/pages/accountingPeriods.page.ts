import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class AccountingPeriodsPage extends BasePage {
  static readonly path = "/accounting-periods";
  static testPoints(): TestPoint[] {
    return [
      new OpenAccountingPeriodsPage(),
      new InspectAccountingPeriodsYearUp(),
      new InspectAccountingPeriodsYearDown(),
    ];
  }

  readonly yearUp: Locator;
  readonly yearDown: Locator;

  constructor(page: Page) {
    super(page, AccountingPeriodsPage.path);
    this.yearUp = this.page.getByRole("button", { name: /increment|year up/i }).or(this.page.locator("button.AccountingYearFilter-InputBtnUp"));
    this.yearDown = this.page.getByRole("button", { name: /decrement|year down/i }).or(this.page.locator("button.AccountingYearFilter-InputBtnDown"));
  }
}

export class OpenAccountingPeriodsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ACCOUNTING_PERIODS", "Open /accounting-periods", async (page) => {
      const pom = new AccountingPeriodsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAccountingPeriodsYearUp extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_PERIODS-01",
      "Inspect \"pi pi-angle-up\" on /accounting-periods",
      async (page) => {
        const pom = new AccountingPeriodsPage(page);
        await pom.expectVisible(pom.yearUp, "TP-BTN-ACCOUNTING_PERIODS-01 pi pi-angle-up on /accounting-periods");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingPeriodsYearDown extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_PERIODS-02",
      "Inspect \"pi pi-angle-down\" on /accounting-periods",
      async (page) => {
        const pom = new AccountingPeriodsPage(page);
        await pom.expectVisible(pom.yearDown, "TP-BTN-ACCOUNTING_PERIODS-02 pi pi-angle-down on /accounting-periods");
      },
      "*****",
      "ready",
    );
  }
}

