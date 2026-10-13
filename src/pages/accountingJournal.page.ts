import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class AccountingJournalPage extends BasePage {
  static readonly path = "/accounting-journal";
  static testPoints(): TestPoint[] {
    return [
      new OpenAccountingJournalPage(),
      new InspectAccountingJournalSaleSource(),
      new InspectAccountingJournalSearch(),
      new InspectAccountingJournalDateRange(),
      new InspectAccountingJournalSelectAChannelType(),
      new InspectAccountingJournalExtraFiltersButton(),
      new InspectAccountingJournalSearchAdvanced(),
    ];
  }

  readonly saleSource: Locator;
  readonly search: Locator;
  readonly dateRange: Locator;
  readonly selectAChannelType: Locator;
  readonly extraFiltersButton: Locator;
  readonly searchAdvanced: Locator;

  constructor(page: Page) {
    super(page, AccountingJournalPage.path);
    this.saleSource = this.findDropdown("Sale Source");
    this.search = this.findNamedButton("Search", 0);
    this.dateRange = this.findCalendarTrigger();
    this.selectAChannelType = this.findDropdown("Select a channel type");
    this.extraFiltersButton = this.findExtraFilters();
    this.searchAdvanced = this.findNamedButton("Search", 1);
  }
}

export class OpenAccountingJournalPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ACCOUNTING_JOURNAL", "Open /accounting-journal", async (page) => {
      const pom = new AccountingJournalPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAccountingJournalSaleSource extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_JOURNAL-01",
      "Inspect \"Sale Source\" on /accounting-journal",
      async (page) => {
        const pom = new AccountingJournalPage(page);
        await pom.expectVisible(pom.saleSource, "TP-BTN-ACCOUNTING_JOURNAL-01 Sale Source on /accounting-journal");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingJournalSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_JOURNAL-02",
      "Inspect \"Search\" on /accounting-journal",
      async (page) => {
        const pom = new AccountingJournalPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ACCOUNTING_JOURNAL-02 Search on /accounting-journal");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingJournalDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_JOURNAL-03",
      "Inspect \"pi pi-calendar\" on /accounting-journal",
      async (page) => {
        const pom = new AccountingJournalPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-ACCOUNTING_JOURNAL-03 pi pi-calendar on /accounting-journal");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingJournalSelectAChannelType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_JOURNAL-04",
      "Inspect \"Select a channel type\" on /accounting-journal",
      async (page) => {
        const pom = new AccountingJournalPage(page);
        await pom.expectVisible(pom.selectAChannelType, "TP-BTN-ACCOUNTING_JOURNAL-04 Select a channel type on /accounting-journal");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingJournalExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_JOURNAL-05",
      "Inspect \"pi pi-filter\" on /accounting-journal",
      async (page) => {
        const pom = new AccountingJournalPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-ACCOUNTING_JOURNAL-05 pi pi-filter on /accounting-journal");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingJournalSearchAdvanced extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_JOURNAL-06",
      "Inspect \"Search\" on /accounting-journal",
      async (page) => {
        const pom = new AccountingJournalPage(page);
        await pom.expectVisible(pom.searchAdvanced, "TP-BTN-ACCOUNTING_JOURNAL-06 Search on /accounting-journal");
      },
      "*****",
      "ready",
    );
  }
}

