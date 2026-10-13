import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class SettlementReconciliationSettingsPage extends BasePage {
  static readonly path = "/settlement-reconciliation-settings";
  static testPoints(): TestPoint[] {
    return [
      new OpenSettlementReconciliationSettingsPage(),
      new InspectSettlementReconciliationSettingsTriggerNow(),
    ];
  }

  readonly triggerNow: Locator;

  constructor(page: Page) {
    super(page, SettlementReconciliationSettingsPage.path);
    this.triggerNow = this.findNamedButton(/trigger now/i);
  }
}

export class OpenSettlementReconciliationSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SETTLEMENT_RECONCILIATION_SETTINGS", "Open /settlement-reconciliation-settings", async (page) => {
      const pom = new SettlementReconciliationSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSettlementReconciliationSettingsTriggerNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_RECONCILIATION_SETTINGS-01",
      "Inspect (do not click) \"Trigger now\" on /settlement-reconciliation-settings",
      async (page) => {
        const pom = new SettlementReconciliationSettingsPage(page);
        await pom.expectVisible(pom.triggerNow, "TP-BTN-SETTLEMENT_RECONCILIATION_SETTINGS-01 Trigger now on /settlement-reconciliation-settings");
        logger.info(`Skipping click for destructive control TP-BTN-SETTLEMENT_RECONCILIATION_SETTINGS-01: Trigger now`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class TriggerNow extends TestPoint {
  constructor() {
    super("TP2500", "Click on Trigger Now Button", async (page) => {
      const pom = new SettlementReconciliationSettingsPage(page);
      await pom.expectOnPage();
      await pom.triggerNow.click();
      logger.info("Clicked Trigger Now");
    });
  }
}
