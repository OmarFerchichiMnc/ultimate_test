import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class BankReconciliationSettingsPage extends BasePage {
  static readonly path = "/bank-reconciliation-settings";
  static testPoints(): TestPoint[] {
    return [
      new OpenBankReconciliationSettingsPage(),
      new InspectBankReconciliationSettingsTriggerNow(),
    ];
  }

  readonly triggerNow: Locator;

  constructor(page: Page) {
    super(page, BankReconciliationSettingsPage.path);
    this.triggerNow = this.findNamedButton(/trigger now/i);
  }
}

export class OpenBankReconciliationSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-BANK_RECONCILIATION_SETTINGS", "Open /bank-reconciliation-settings", async (page) => {
      const pom = new BankReconciliationSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectBankReconciliationSettingsTriggerNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-BANK_RECONCILIATION_SETTINGS-01",
      "Inspect (do not click) \"Trigger now\" on /bank-reconciliation-settings",
      async (page) => {
        const pom = new BankReconciliationSettingsPage(page);
        await pom.expectVisible(pom.triggerNow, "TP-BTN-BANK_RECONCILIATION_SETTINGS-01 Trigger now on /bank-reconciliation-settings");
        logger.info(`Skipping click for destructive control TP-BTN-BANK_RECONCILIATION_SETTINGS-01: Trigger now`);
      },
      "*****",
      "inspect-only",
    );
  }
}

