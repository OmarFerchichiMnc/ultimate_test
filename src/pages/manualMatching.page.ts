import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class ManualMatchingPage extends BasePage {
  static readonly path = "/manual-matching";
  static testPoints(): TestPoint[] {
    return [
      new OpenManualMatchingPage(),
      new InspectManualMatchingSettlementReconciliation(),
      new InspectManualMatchingPaymentCurrencyTab(),
      new InspectManualMatchingAccountingCurrencyTab(),
      new InspectManualMatchingConfirm(),
      new InspectManualMatchingResetAll(),
      new InspectManualMatchingSearch(),
      new InspectManualMatchingDateRange(),
      new InspectManualMatchingSelectAChannelType(),
      new InspectManualMatchingExtraFiltersButton(),
      new InspectManualMatchingSearchAdvanced(),
      new InspectManualMatchingSelectCustomerAcquirer(),
    ];
  }

  readonly settlementReconciliation: Locator;
  readonly paymentCurrencyTab: Locator;
  readonly accountingCurrencyTab: Locator;
  readonly confirm: Locator;
  readonly resetAll: Locator;
  readonly search: Locator;
  readonly dateRange: Locator;
  readonly selectAChannelType: Locator;
  readonly extraFiltersButton: Locator;
  readonly searchAdvanced: Locator;
  readonly selectCustomerAcquirer: Locator;
  readonly salePnrRadio: Locator;
  readonly salePnrInput: Locator;
  readonly saleQuickSearch: Locator;
  readonly settlementPnrRadio: Locator;
  readonly settlementPnrInput: Locator;
  readonly settlementQuickSearch: Locator;
  readonly saleCheckbox: Locator;
  readonly settlementCheckbox: Locator;
  readonly matchDialogButton: Locator;
  readonly confirmYes: Locator;

  constructor(page: Page) {
    super(page, ManualMatchingPage.path);
    this.settlementReconciliation = this.findDropdown("Settlement Reconciliation");
    this.paymentCurrencyTab = this.findTab("Payment Currency");
    this.accountingCurrencyTab = this.findTab("Accounting Currency");
    this.confirm = this.page.getByRole("button", { name: /^confirm$/i });
    this.resetAll = this.page.getByRole("button", { name: /reset all/i });
    this.search = this.findNamedButton("Search", 0);
    this.dateRange = this.findCalendarTrigger();
    this.selectAChannelType = this.findDropdown("Select a channel type");
    this.extraFiltersButton = this.findExtraFilters();
    this.searchAdvanced = this.findNamedButton("Search", 1);
    this.selectCustomerAcquirer = this.findDropdown("Select Customer/Acquirer");
    this.salePnrRadio = this.findRadio("PNR/Order Reference", this.page.locator("adad-frontend-sales-list"));
    this.salePnrInput = this.page.locator("adad-frontend-sales-list").getByRole("textbox").first();
    this.saleQuickSearch = this.page.locator("adad-frontend-sales-list").getByRole("button", { name: "Search" }).first();
    this.settlementPnrRadio = this.findRadio("PNR/Order Reference", this.page.locator("adad-frontend-settlements-list"));
    this.settlementPnrInput = this.page.locator("adad-frontend-settlements-list").getByRole("textbox").first();
    this.settlementQuickSearch = this.page.locator("adad-frontend-settlements-list").getByRole("button", { name: "Search" }).first();
    this.saleCheckbox = this.page.locator("adad-frontend-sales-list").getByRole("checkbox").first();
    this.settlementCheckbox = this.page.locator("adad-frontend-settlements-list").getByRole("checkbox").first();
    this.matchDialogButton = this.page.getByRole("dialog").getByRole("button").last();
    this.confirmYes = this.page.getByRole("button", { name: /^yes$/i });
  }
}

export class OpenManualMatchingPage extends TestPoint {
  constructor() {
    super("TP-OPEN-MANUAL_MATCHING", "Open /manual-matching", async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectManualMatchingSettlementReconciliation extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-01",
      "Inspect \"Settlement Reconciliation\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.settlementReconciliation, "TP-BTN-MANUAL_MATCHING-01 Settlement Reconciliation on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingPaymentCurrencyTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-02",
      "Inspect \"Payment Currency\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.paymentCurrencyTab, "TP-BTN-MANUAL_MATCHING-02 Payment Currency on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingAccountingCurrencyTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-03",
      "Inspect \"Accounting Currency\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.accountingCurrencyTab, "TP-BTN-MANUAL_MATCHING-03 Accounting Currency on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingConfirm extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-04",
      "Inspect (do not click) \"Confirm\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.confirm, "TP-BTN-MANUAL_MATCHING-04 Confirm on /manual-matching");
        logger.info(`Skipping click for destructive control TP-BTN-MANUAL_MATCHING-04: Confirm`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectManualMatchingResetAll extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-05",
      "Inspect \"Reset All\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.resetAll, "TP-BTN-MANUAL_MATCHING-05 Reset All on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-06",
      "Inspect \"Search\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-MANUAL_MATCHING-06 Search on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-07",
      "Inspect \"pi pi-calendar\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-MANUAL_MATCHING-07 pi pi-calendar on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingSelectAChannelType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-08",
      "Inspect \"Select a channel type\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.selectAChannelType, "TP-BTN-MANUAL_MATCHING-08 Select a channel type on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-09",
      "Inspect \"pi pi-filter\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-MANUAL_MATCHING-09 pi pi-filter on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingSearchAdvanced extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-10",
      "Inspect \"Search\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.searchAdvanced, "TP-BTN-MANUAL_MATCHING-10 Search on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectManualMatchingSelectCustomerAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MANUAL_MATCHING-11",
      "Inspect \"Select Customer/Acquirer\" on /manual-matching",
      async (page) => {
        const pom = new ManualMatchingPage(page);
        await pom.expectVisible(pom.selectCustomerAcquirer, "TP-BTN-MANUAL_MATCHING-11 Select Customer/Acquirer on /manual-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class ManualMatchingUIFilterSelectPNROrderREferenceToFilter extends TestPoint {
  constructor() {
    super("TP", "click PNR/Order Reference icon in manual matching view", async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.expectOnPage();
      await pom.salePnrRadio.click();
    });
  }
}

export class ManualMatchingSaleUIFilterPNROrderReference extends TestPoint {
  constructor(pnr: string) {
    super("TP", "Filter PNR Order Reference", async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.expectOnPage();
      await pom.salePnrInput.fill(pnr);
    });
  }
}

export class ManualMatchingUISaleClickSearchQuickFilters extends TestPoint {
  constructor() {
    super("TP1415", "click the sale Search button in manual matching page", async (page) => {
      await new ManualMatchingPage(page).saleQuickSearch.click();
    });
  }
}

export class ManualMatchingUISettlementFilterSelectPNROrderReferenceToFilter extends TestPoint {
  constructor() {
    super("TP", "click PNR/Order Reference icon in manual matching view settlement", async (page) => {
      await new ManualMatchingPage(page).settlementPnrRadio.click();
    });
  }
}

export class ManualMatchingSettlementUIFilterPNROrderReference extends TestPoint {
  constructor(pnr: string) {
    super("TP", "Filter PNR Order Reference settlement", async (page) => {
      await new ManualMatchingPage(page).settlementPnrInput.fill(pnr);
    });
  }
}

export class ManualMatchingUISettlmeentClickSearchQuickFilters extends TestPoint {
  constructor() {
    super("TP", "click the settlement Search button in manual matching page", async (page) => {
      await new ManualMatchingPage(page).settlementQuickSearch.click();
    });
  }
}

export class ManualMatchingUISaleClickCheckBox extends TestPoint {
  constructor() {
    super("TP1416", "click the sale checkbox", async (page) => {
      await new ManualMatchingPage(page).saleCheckbox.click();
    });
  }
}

export class ManualMatchingUISettlementClickCheckBox extends TestPoint {
  constructor() {
    super("TP1417", "click the settlement checkbox", async (page) => {
      await new ManualMatchingPage(page).settlementCheckbox.click();
    });
  }
}

export class ManualMatchingUIConfirmMatching extends TestPoint {
  constructor() {
    super("TP1418", "click the confirmation", async (page) => {
      await new ManualMatchingPage(page).confirm.click();
    });
  }
}

export class ManualMatchingUIMatchSaleAndSettlement extends TestPoint {
  constructor() {
    super("TP1419", "click the Match Sale And Settlement", async (page) => {
      await new ManualMatchingPage(page).matchDialogButton.click();
    });
  }
}

export class ManualMatchingUIMatchSaleAndSettlementClickYes extends TestPoint {
  constructor() {
    super("TP1420", "click Match Sale And Settlement Yes", async (page) => {
      await new ManualMatchingPage(page).confirmYes.click();
      logger.info("Match Sale And Settlement Yes clicked");
    });
  }
}
