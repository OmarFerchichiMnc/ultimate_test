import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class SettlementDisputesPage extends BasePage {
  static readonly path = "/settlement-disputes";
  static testPoints(): TestPoint[] {
    return [
      new OpenSettlementDisputesPage(),
      new InspectSettlementDisputesDateRange(),
      new InspectSettlementDisputesSelectCustomerAcquirer(),
      new InspectSettlementDisputesSelectStatus(),
      new InspectSettlementDisputesDisputeAmount(),
      new InspectSettlementDisputesExtraFiltersButton(),
      new InspectSettlementDisputesSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectCustomerAcquirer: Locator;
  readonly selectStatus: Locator;
  readonly disputeAmount: Locator;
  readonly extraFiltersButton: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, SettlementDisputesPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectCustomerAcquirer = this.findDropdown("Select Customer/Acquirer");
    this.selectStatus = this.findDropdown("Select status");
    this.disputeAmount = this.findDropdown("Dispute Amount");
    this.extraFiltersButton = this.findExtraFilters();
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenSettlementDisputesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SETTLEMENT_DISPUTES", "Open /settlement-disputes", async (page) => {
      const pom = new SettlementDisputesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSettlementDisputesDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_DISPUTES-01",
      "Inspect \"pi pi-calendar\" on /settlement-disputes",
      async (page) => {
        const pom = new SettlementDisputesPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-SETTLEMENT_DISPUTES-01 pi pi-calendar on /settlement-disputes");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementDisputesSelectCustomerAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_DISPUTES-02",
      "Inspect \"Select Customer/Acquirer\" on /settlement-disputes",
      async (page) => {
        const pom = new SettlementDisputesPage(page);
        await pom.expectVisible(pom.selectCustomerAcquirer, "TP-BTN-SETTLEMENT_DISPUTES-02 Select Customer/Acquirer on /settlement-disputes");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementDisputesSelectStatus extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_DISPUTES-03",
      "Inspect \"Select status\" on /settlement-disputes",
      async (page) => {
        const pom = new SettlementDisputesPage(page);
        await pom.expectVisible(pom.selectStatus, "TP-BTN-SETTLEMENT_DISPUTES-03 Select status on /settlement-disputes");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementDisputesDisputeAmount extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_DISPUTES-04",
      "Inspect \"Dispute Amount\" on /settlement-disputes",
      async (page) => {
        const pom = new SettlementDisputesPage(page);
        await pom.expectVisible(pom.disputeAmount, "TP-BTN-SETTLEMENT_DISPUTES-04 Dispute Amount on /settlement-disputes");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementDisputesExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_DISPUTES-05",
      "Inspect \"pi pi-filter\" on /settlement-disputes",
      async (page) => {
        const pom = new SettlementDisputesPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-SETTLEMENT_DISPUTES-05 pi pi-filter on /settlement-disputes");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementDisputesSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTLEMENT_DISPUTES-06",
      "Inspect \"Search\" on /settlement-disputes",
      async (page) => {
        const pom = new SettlementDisputesPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-SETTLEMENT_DISPUTES-06 Search on /settlement-disputes");
      },
      "*****",
      "ready",
    );
  }
}

