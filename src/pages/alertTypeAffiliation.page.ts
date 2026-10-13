import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class AlertTypeAffiliationPage extends BasePage {
  static readonly path = "/alert-type-affiliation";
  static testPoints(): TestPoint[] {
    return [
      new OpenAlertTypeAffiliationPage(),
      new InspectAlertTypeAffiliationCopy(),
      new InspectAlertTypeAffiliationEdit(),
    ];
  }

  readonly copy: Locator;
  readonly edit: Locator;

  constructor(page: Page) {
    super(page, AlertTypeAffiliationPage.path);
    this.copy = this.findCopyButton();
    this.edit = this.findIconButton("pi-pencil");
  }
}

export class OpenAlertTypeAffiliationPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ALERT_TYPE_AFFILIATION", "Open /alert-type-affiliation", async (page) => {
      const pom = new AlertTypeAffiliationPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAlertTypeAffiliationCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERT_TYPE_AFFILIATION-01",
      "Inspect \"pi pi-copy\" on /alert-type-affiliation",
      async (page) => {
        const pom = new AlertTypeAffiliationPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-ALERT_TYPE_AFFILIATION-01 pi pi-copy on /alert-type-affiliation");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertTypeAffiliationEdit extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERT_TYPE_AFFILIATION-02",
      "Inspect \"pi pi-pencil\" on /alert-type-affiliation",
      async (page) => {
        const pom = new AlertTypeAffiliationPage(page);
        await pom.expectVisible(pom.edit, "TP-BTN-ALERT_TYPE_AFFILIATION-02 pi pi-pencil on /alert-type-affiliation");
      },
      "*****",
      "ready",
    );
  }
}

