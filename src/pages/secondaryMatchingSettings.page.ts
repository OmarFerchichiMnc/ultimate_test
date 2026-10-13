import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class SecondaryMatchingSettingsPage extends BasePage {
  static readonly path = "/secondary-matching-settings";
  static testPoints(): TestPoint[] {
    return [
      new OpenSecondaryMatchingSettingsPage(),
      new InspectSecondaryMatchingSettingsTriggerNow(),
    ];
  }

  readonly triggerNow: Locator;

  constructor(page: Page) {
    super(page, SecondaryMatchingSettingsPage.path);
    this.triggerNow = this.findNamedButton(/trigger now/i);
  }
}

export class OpenSecondaryMatchingSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SECONDARY_MATCHING_SETTINGS", "Open /secondary-matching-settings", async (page) => {
      const pom = new SecondaryMatchingSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSecondaryMatchingSettingsTriggerNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SECONDARY_MATCHING_SETTINGS-01",
      "Inspect (do not click) \"Trigger now\" on /secondary-matching-settings",
      async (page) => {
        const pom = new SecondaryMatchingSettingsPage(page);
        await pom.expectVisible(pom.triggerNow, "TP-BTN-SECONDARY_MATCHING_SETTINGS-01 Trigger now on /secondary-matching-settings");
        logger.info(`Skipping click for destructive control TP-BTN-SECONDARY_MATCHING_SETTINGS-01: Trigger now`);
      },
      "*****",
      "inspect-only",
    );
  }
}

