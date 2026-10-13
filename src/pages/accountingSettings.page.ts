import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class AccountingSettingsPage extends BasePage {
  static readonly path = "/accounting-settings";
  static testPoints(): TestPoint[] {
    return [
      new OpenAccountingSettingsPage(),
      new InspectAccountingSettingsGenerateNow(),
      new InspectAccountingSettingsCheckNow(),
      new InspectAccountingSettingsCalculateNow(),
      new InspectAccountingSettingsReplay(),
    ];
  }

  readonly generateNow: Locator;
  readonly checkNow: Locator;
  readonly calculateNow: Locator;
  readonly replay: Locator;

  constructor(page: Page) {
    super(page, AccountingSettingsPage.path);
    this.generateNow = this.findNamedButton(/generate now/i);
    this.checkNow = this.page.getByRole("button", { name: /check now/i }).or(this.page.locator("button.AccountingScheduledJobsActions-JournalEntriesBalanceCheckBtn"));
    this.calculateNow = this.page.getByRole("button", { name: /calculate now/i }).or(this.page.locator("button.AccountingScheduledJobsActions-ClosedAccountingPeriodBalanceCalculationBtn"));
    this.replay = this.findNamedButton("Replay");
  }
}

export class OpenAccountingSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ACCOUNTING_SETTINGS", "Open /accounting-settings", async (page) => {
      const pom = new AccountingSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAccountingSettingsGenerateNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_SETTINGS-01",
      "Inspect (do not click) \"Generate now\" on /accounting-settings",
      async (page) => {
        const pom = new AccountingSettingsPage(page);
        await pom.expectVisible(pom.generateNow, "TP-BTN-ACCOUNTING_SETTINGS-01 Generate now on /accounting-settings");
        logger.info(`Skipping click for destructive control TP-BTN-ACCOUNTING_SETTINGS-01: Generate now`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectAccountingSettingsCheckNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_SETTINGS-02",
      "Inspect \"Check now\" on /accounting-settings",
      async (page) => {
        const pom = new AccountingSettingsPage(page);
        await pom.expectVisible(pom.checkNow, "TP-BTN-ACCOUNTING_SETTINGS-02 Check now on /accounting-settings");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingSettingsCalculateNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_SETTINGS-03",
      "Inspect \"Calculate now\" on /accounting-settings",
      async (page) => {
        const pom = new AccountingSettingsPage(page);
        await pom.expectVisible(pom.calculateNow, "TP-BTN-ACCOUNTING_SETTINGS-03 Calculate now on /accounting-settings");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingSettingsReplay extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_SETTINGS-04",
      "Inspect \"Replay\" on /accounting-settings",
      async (page) => {
        const pom = new AccountingSettingsPage(page);
        await pom.expectVisible(pom.replay, "TP-BTN-ACCOUNTING_SETTINGS-04 Replay on /accounting-settings");
      },
      "*****",
      "ready",
    );
  }
}

