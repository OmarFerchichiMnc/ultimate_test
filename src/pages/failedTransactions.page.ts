import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class FailedTransactionsPage extends BasePage {
  static readonly path = "/failed-transactions";
  static testPoints(): TestPoint[] {
    return [
      new OpenFailedTransactionsPage(),
      new InspectFailedTransactionsSaleSource(),
      new InspectFailedTransactionsDateRange(),
      new InspectFailedTransactionsSelectAChannelType(),
      new InspectFailedTransactionsExtraFiltersButton(),
      new InspectFailedTransactionsSearch(),
      new InspectFailedTransactionsExportButton(),
      new InspectFailedTransactionsLoadMore(),
      new InspectFailedTransactionsPaginatorFirst(),
      new InspectFailedTransactionsPaginatorPrev(),
      new InspectFailedTransactionsPaginatorPage1(),
      new InspectFailedTransactionsPaginatorNext(),
      new InspectFailedTransactionsPaginatorLast(),
    ];
  }

  readonly saleSource: Locator;
  readonly dateRange: Locator;
  readonly selectAChannelType: Locator;
  readonly extraFiltersButton: Locator;
  readonly search: Locator;
  readonly exportButton: Locator;
  readonly loadMore: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, FailedTransactionsPage.path);
    this.saleSource = this.findDropdown("Sale Source");
    this.dateRange = this.findCalendarTrigger();
    this.selectAChannelType = this.findDropdown("Select a channel type");
    this.extraFiltersButton = this.findExtraFilters();
    this.search = this.findNamedButton("Search", 0);
    this.exportButton = this.findExportButton();
    this.loadMore = this.findNamedButton("Load more");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenFailedTransactionsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-FAILED_TRANSACTIONS", "Open /failed-transactions", async (page) => {
      const pom = new FailedTransactionsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectFailedTransactionsSaleSource extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-01",
      "Inspect \"Sale Source\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.saleSource, "TP-BTN-FAILED_TRANSACTIONS-01 Sale Source on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-02",
      "Inspect \"pi pi-calendar\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-FAILED_TRANSACTIONS-02 pi pi-calendar on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsSelectAChannelType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-03",
      "Inspect \"Select a channel type\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.selectAChannelType, "TP-BTN-FAILED_TRANSACTIONS-03 Select a channel type on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-04",
      "Inspect \"pi pi-filter\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-FAILED_TRANSACTIONS-04 pi pi-filter on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-05",
      "Inspect \"Search\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-FAILED_TRANSACTIONS-05 Search on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsExportButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-06",
      "Inspect \"Export\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.exportButton, "TP-BTN-FAILED_TRANSACTIONS-06 Export on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-07",
      "Inspect \"Load more\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-FAILED_TRANSACTIONS-07 Load more on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-08",
      "Inspect \"paginator:pi pi-angle-double-left\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-FAILED_TRANSACTIONS-08 paginator:pi pi-angle-double-left on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-09",
      "Inspect \"paginator:pi pi-angle-left\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-FAILED_TRANSACTIONS-09 paginator:pi pi-angle-left on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-10",
      "Inspect \"paginator:1\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-FAILED_TRANSACTIONS-10 paginator:1 on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-11",
      "Inspect \"paginator:pi pi-angle-right\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-FAILED_TRANSACTIONS-11 paginator:pi pi-angle-right on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFailedTransactionsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FAILED_TRANSACTIONS-12",
      "Inspect \"paginator:pi pi-angle-double-right\" on /failed-transactions",
      async (page) => {
        const pom = new FailedTransactionsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-FAILED_TRANSACTIONS-12 paginator:pi pi-angle-double-right on /failed-transactions");
      },
      "*****",
      "ready",
    );
  }
}

