import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class ReconciliationAlertsPage extends BasePage {
  static readonly path = "/reconciliation-alerts";
  static testPoints(): TestPoint[] {
    return [
      new OpenReconciliationAlertsPage(),
      new InspectReconciliationAlertsDateRange(),
      new InspectReconciliationAlertsSelectAlertType(),
      new InspectReconciliationAlertsSelectFopCode(),
      new InspectReconciliationAlertsSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectAlertType: Locator;
  readonly selectFopCode: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, ReconciliationAlertsPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectAlertType = this.findDropdown("Select alert type");
    this.selectFopCode = this.findDropdown("Select FOP Code");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenReconciliationAlertsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-RECONCILIATION_ALERTS", "Open /reconciliation-alerts", async (page) => {
      const pom = new ReconciliationAlertsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectReconciliationAlertsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-RECONCILIATION_ALERTS-01",
      "Inspect \"pi pi-calendar\" on /reconciliation-alerts",
      async (page) => {
        const pom = new ReconciliationAlertsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-RECONCILIATION_ALERTS-01 pi pi-calendar on /reconciliation-alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectReconciliationAlertsSelectAlertType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-RECONCILIATION_ALERTS-02",
      "Inspect \"Select alert type\" on /reconciliation-alerts",
      async (page) => {
        const pom = new ReconciliationAlertsPage(page);
        await pom.expectVisible(pom.selectAlertType, "TP-BTN-RECONCILIATION_ALERTS-02 Select alert type on /reconciliation-alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectReconciliationAlertsSelectFopCode extends TestPoint {
  constructor() {
    super(
      "TP-BTN-RECONCILIATION_ALERTS-03",
      "Inspect \"Select FOP Code\" on /reconciliation-alerts",
      async (page) => {
        const pom = new ReconciliationAlertsPage(page);
        await pom.expectVisible(pom.selectFopCode, "TP-BTN-RECONCILIATION_ALERTS-03 Select FOP Code on /reconciliation-alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectReconciliationAlertsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-RECONCILIATION_ALERTS-04",
      "Inspect \"Search\" on /reconciliation-alerts",
      async (page) => {
        const pom = new ReconciliationAlertsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-RECONCILIATION_ALERTS-04 Search on /reconciliation-alerts");
      },
      "*****",
      "ready",
    );
  }
}

