import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class TrialBalancePage extends BasePage {
  static readonly path = "/trial-balance";
  static testPoints(): TestPoint[] {
    return [
      new OpenTrialBalancePage(),
      new InspectTrialBalanceDateRange(),
      new InspectTrialBalanceSelectAccountNumber(),
      new InspectTrialBalanceSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectAccountNumber: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, TrialBalancePage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectAccountNumber = this.findDropdown("Select account number");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenTrialBalancePage extends TestPoint {
  constructor() {
    super("TP-OPEN-TRIAL_BALANCE", "Open /trial-balance", async (page) => {
      const pom = new TrialBalancePage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectTrialBalanceDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-TRIAL_BALANCE-01",
      "Inspect \"pi pi-calendar\" on /trial-balance",
      async (page) => {
        const pom = new TrialBalancePage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-TRIAL_BALANCE-01 pi pi-calendar on /trial-balance");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTrialBalanceSelectAccountNumber extends TestPoint {
  constructor() {
    super(
      "TP-BTN-TRIAL_BALANCE-02",
      "Inspect \"Select account number\" on /trial-balance",
      async (page) => {
        const pom = new TrialBalancePage(page);
        await pom.expectVisible(pom.selectAccountNumber, "TP-BTN-TRIAL_BALANCE-02 Select account number on /trial-balance");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTrialBalanceSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-TRIAL_BALANCE-03",
      "Inspect \"Search\" on /trial-balance",
      async (page) => {
        const pom = new TrialBalancePage(page);
        await pom.expectVisible(pom.search, "TP-BTN-TRIAL_BALANCE-03 Search on /trial-balance");
      },
      "*****",
      "ready",
    );
  }
}

