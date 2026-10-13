import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class GeneralSettingsPage extends BasePage {
  static readonly path = "/general-settings";
  static testPoints(): TestPoint[] {
    return [
      new OpenGeneralSettingsPage(),
      new InspectGeneralSettingsRefresh(),
      new InspectGeneralSettingsTriggerNow(),
      new InspectGeneralSettingsGenerateNow(),
    ];
  }

  readonly refresh: Locator;
  readonly triggerNow: Locator;
  readonly generateNow: Locator;

  constructor(page: Page) {
    super(page, GeneralSettingsPage.path);
    this.refresh = this.findNamedButton("Refresh");
    this.triggerNow = this.findNamedButton(/trigger now/i);
    this.generateNow = this.findNamedButton(/generate now/i);
  }
}

export class OpenGeneralSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-GENERAL_SETTINGS", "Open /general-settings", async (page) => {
      const pom = new GeneralSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectGeneralSettingsRefresh extends TestPoint {
  constructor() {
    super(
      "TP-BTN-GENERAL_SETTINGS-01",
      "Inspect \"Refresh\" on /general-settings",
      async (page) => {
        const pom = new GeneralSettingsPage(page);
        await pom.expectVisible(pom.refresh, "TP-BTN-GENERAL_SETTINGS-01 Refresh on /general-settings");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectGeneralSettingsTriggerNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-GENERAL_SETTINGS-02",
      "Inspect (do not click) \"Trigger now\" on /general-settings",
      async (page) => {
        const pom = new GeneralSettingsPage(page);
        await pom.expectVisible(pom.triggerNow, "TP-BTN-GENERAL_SETTINGS-02 Trigger now on /general-settings");
        logger.info(`Skipping click for destructive control TP-BTN-GENERAL_SETTINGS-02: Trigger now`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectGeneralSettingsGenerateNow extends TestPoint {
  constructor() {
    super(
      "TP-BTN-GENERAL_SETTINGS-03",
      "Inspect (do not click) \"Generate now\" on /general-settings",
      async (page) => {
        const pom = new GeneralSettingsPage(page);
        await pom.expectVisible(pom.generateNow, "TP-BTN-GENERAL_SETTINGS-03 Generate now on /general-settings");
        logger.info(`Skipping click for destructive control TP-BTN-GENERAL_SETTINGS-03: Generate now`);
      },
      "*****",
      "inspect-only",
    );
  }
}

