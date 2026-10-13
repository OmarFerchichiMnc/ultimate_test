import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class FileSettingsPage extends BasePage {
  static readonly path = "/settings/file";
  static testPoints(): TestPoint[] {
    return [
      new OpenFileSettingsPage(),
      new InspectFileSettingsAcquirer(),
      new InspectFileSettingsAdyen(),
      new InspectFileSettingsExportButton(),
      new InspectFileSettingsSelectAConfiguration(),
      new InspectFileSettingsPaginatorFirst(),
      new InspectFileSettingsPaginatorPrev(),
      new InspectFileSettingsPaginatorPage1(),
      new InspectFileSettingsPaginatorNext(),
      new InspectFileSettingsPaginatorLast(),
    ];
  }

  readonly acquirer: Locator;
  readonly adyen: Locator;
  readonly exportButton: Locator;
  readonly selectAConfiguration: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, FileSettingsPage.path);
    this.acquirer = this.findDropdown("Acquirer");
    this.adyen = this.findDropdown("adyen");
    this.exportButton = this.findExportButton();
    this.selectAConfiguration = this.findDropdown("Select a configuration");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenFileSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SETTINGS_FILE", "Open /settings/file", async (page) => {
      const pom = new FileSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectFileSettingsAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-01",
      "Inspect \"Acquirer\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.acquirer, "TP-BTN-SETTINGS_FILE-01 Acquirer on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsAdyen extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-02",
      "Inspect \"adyen\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.adyen, "TP-BTN-SETTINGS_FILE-02 adyen on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsExportButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-03",
      "Inspect \"Export\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.exportButton, "TP-BTN-SETTINGS_FILE-03 Export on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsSelectAConfiguration extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-04",
      "Inspect \"Select a configuration\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.selectAConfiguration, "TP-BTN-SETTINGS_FILE-04 Select a configuration on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-05",
      "Inspect \"paginator:pi pi-angle-double-left\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-SETTINGS_FILE-05 paginator:pi pi-angle-double-left on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-06",
      "Inspect \"paginator:pi pi-angle-left\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-SETTINGS_FILE-06 paginator:pi pi-angle-left on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-07",
      "Inspect \"paginator:1\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-SETTINGS_FILE-07 paginator:1 on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-08",
      "Inspect \"paginator:pi pi-angle-right\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-SETTINGS_FILE-08 paginator:pi pi-angle-right on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileSettingsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_FILE-09",
      "Inspect \"paginator:pi pi-angle-double-right\" on /settings/file",
      async (page) => {
        const pom = new FileSettingsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-SETTINGS_FILE-09 paginator:pi pi-angle-double-right on /settings/file");
      },
      "*****",
      "ready",
    );
  }
}

