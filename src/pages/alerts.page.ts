import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class AlertsPage extends BasePage {
  static readonly path = "/alerts";
  static testPoints(): TestPoint[] {
    return [
      new OpenAlertsPage(),
      new InspectAlertsDateRange(),
      new InspectAlertsSelectCategory(),
      new InspectAlertsSelectType(),
      new InspectAlertsAssignedAvailable(),
      new InspectAlertsSearch(),
      new InspectAlertsActionAlertsTab(),
      new InspectAlertsNotificationAlertsTab(),
      new InspectAlertsTeamInboxTab(),
      new InspectAlertsAssignedToMeTab(),
      new InspectAlertsResolvedTab(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectCategory: Locator;
  readonly selectType: Locator;
  readonly assignedAvailable: Locator;
  readonly search: Locator;
  readonly actionAlertsTab: Locator;
  readonly notificationAlertsTab: Locator;
  readonly teamInboxTab: Locator;
  readonly assignedToMeTab: Locator;
  readonly resolvedTab: Locator;

  constructor(page: Page) {
    super(page, AlertsPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectCategory = this.findDropdown("Select category");
    this.selectType = this.findDropdown("Select type");
    this.assignedAvailable = this.findDropdown("Assigned, Available");
    this.search = this.findNamedButton("Search", 0);
    this.actionAlertsTab = this.findTab("Action Alerts");
    this.notificationAlertsTab = this.findTab("Notification Alerts");
    this.teamInboxTab = this.findTab("Team Inbox");
    this.assignedToMeTab = this.findTab("Assigned to me");
    this.resolvedTab = this.findTab("Resolved");
  }
}

export class OpenAlertsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ALERTS", "Open /alerts", async (page) => {
      const pom = new AlertsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAlertsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-01",
      "Inspect \"pi pi-calendar\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-ALERTS-01 pi pi-calendar on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsSelectCategory extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-02",
      "Inspect \"Select category\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.selectCategory, "TP-BTN-ALERTS-02 Select category on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsSelectType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-03",
      "Inspect \"Select type\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.selectType, "TP-BTN-ALERTS-03 Select type on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsAssignedAvailable extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-04",
      "Inspect \"Assigned, Available\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.assignedAvailable, "TP-BTN-ALERTS-04 Assigned, Available on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-05",
      "Inspect \"Search\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ALERTS-05 Search on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsActionAlertsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-06",
      "Inspect \"Action Alerts\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.actionAlertsTab, "TP-BTN-ALERTS-06 Action Alerts on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsNotificationAlertsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-07",
      "Inspect \"Notification Alerts\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.notificationAlertsTab, "TP-BTN-ALERTS-07 Notification Alerts on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsTeamInboxTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-08",
      "Inspect \"Team Inbox\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.teamInboxTab, "TP-BTN-ALERTS-08 Team Inbox on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsAssignedToMeTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-09",
      "Inspect \"Assigned to me\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.assignedToMeTab, "TP-BTN-ALERTS-09 Assigned to me on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAlertsResolvedTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ALERTS-10",
      "Inspect \"Resolved\" on /alerts",
      async (page) => {
        const pom = new AlertsPage(page);
        await pom.expectVisible(pom.resolvedTab, "TP-BTN-ALERTS-10 Resolved on /alerts");
      },
      "*****",
      "ready",
    );
  }
}

