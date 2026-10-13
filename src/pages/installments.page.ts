import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class InstallmentsPage extends BasePage {
  static readonly path = "/installments";
  static testPoints(): TestPoint[] {
    return [
      new OpenInstallmentsPage(),
      new InspectInstallmentsSearch(),
      new InspectInstallmentsPendingForInstallmentsTab(),
      new InspectInstallmentsCompletedInstallmentsTab(),
    ];
  }

  readonly search: Locator;
  readonly pendingForInstallmentsTab: Locator;
  readonly completedInstallmentsTab: Locator;

  constructor(page: Page) {
    super(page, InstallmentsPage.path);
    this.search = this.findNamedButton("Search", 0);
    this.pendingForInstallmentsTab = this.findTab("Pending for Installments");
    this.completedInstallmentsTab = this.findTab("Completed Installments");
  }
}

export class OpenInstallmentsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-INSTALLMENTS", "Open /installments", async (page) => {
      const pom = new InstallmentsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectInstallmentsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-INSTALLMENTS-01",
      "Inspect \"Search\" on /installments",
      async (page) => {
        const pom = new InstallmentsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-INSTALLMENTS-01 Search on /installments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectInstallmentsPendingForInstallmentsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-INSTALLMENTS-02",
      "Inspect \"Pending for Installments\" on /installments",
      async (page) => {
        const pom = new InstallmentsPage(page);
        await pom.expectVisible(pom.pendingForInstallmentsTab, "TP-BTN-INSTALLMENTS-02 Pending for Installments on /installments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectInstallmentsCompletedInstallmentsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-INSTALLMENTS-03",
      "Inspect \"Completed Installments\" on /installments",
      async (page) => {
        const pom = new InstallmentsPage(page);
        await pom.expectVisible(pom.completedInstallmentsTab, "TP-BTN-INSTALLMENTS-03 Completed Installments on /installments");
      },
      "*****",
      "ready",
    );
  }
}

