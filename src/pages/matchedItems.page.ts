import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class MatchedItemsPage extends BasePage {
  static readonly path = "/matched-items";
  static testPoints(): TestPoint[] {
    return [
      new OpenMatchedItemsPage(),
      new InspectMatchedItemsSettlementReconciliation(),
      new InspectMatchedItemsDateRange(),
      new InspectMatchedItemsSelectMatchingStatus(),
      new InspectMatchedItemsSelectReconciliationStatus(),
      new InspectMatchedItemsSearch(),
      new InspectMatchedItemsExportButton(),
      new InspectMatchedItemsCopy(),
      new InspectMatchedItemsView(),
      new InspectMatchedItemsLoadMore(),
      new InspectMatchedItemsPaginatorFirst(),
      new InspectMatchedItemsPaginatorPrev(),
      new InspectMatchedItemsPaginatorPage1(),
      new InspectMatchedItemsPaginatorNext(),
      new InspectMatchedItemsPaginatorLast(),
    ];
  }

  readonly settlementReconciliation: Locator;
  readonly dateRange: Locator;
  readonly selectMatchingStatus: Locator;
  readonly selectReconciliationStatus: Locator;
  readonly search: Locator;
  readonly exportButton: Locator;
  readonly copy: Locator;
  readonly view: Locator;
  readonly loadMore: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, MatchedItemsPage.path);
    this.settlementReconciliation = this.findDropdown("Settlement Reconciliation");
    this.dateRange = this.findCalendarTrigger();
    this.selectMatchingStatus = this.findDropdown("Select Matching Status");
    this.selectReconciliationStatus = this.findDropdown("Select Reconciliation Status");
    this.search = this.findNamedButton("Search", 0);
    this.exportButton = this.findExportButton();
    this.copy = this.findCopyButton();
    this.view = this.findIconButton("pi-eye");
    this.loadMore = this.findNamedButton("Load more");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenMatchedItemsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-MATCHED_ITEMS", "Open /matched-items", async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectMatchedItemsSettlementReconciliation extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-01",
      "Inspect \"Settlement Reconciliation\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.settlementReconciliation, "TP-BTN-MATCHED_ITEMS-01 Settlement Reconciliation on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-02",
      "Inspect \"pi pi-calendar\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-MATCHED_ITEMS-02 pi pi-calendar on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsSelectMatchingStatus extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-03",
      "Inspect (do not click) \"Select Matching Status\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.selectMatchingStatus, "TP-BTN-MATCHED_ITEMS-03 Select Matching Status on /matched-items");
        logger.info(`Skipping click for destructive control TP-BTN-MATCHED_ITEMS-03: Select Matching Status`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectMatchedItemsSelectReconciliationStatus extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-04",
      "Inspect \"Select Reconciliation Status\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.selectReconciliationStatus, "TP-BTN-MATCHED_ITEMS-04 Select Reconciliation Status on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-05",
      "Inspect \"Search\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-MATCHED_ITEMS-05 Search on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsExportButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-06",
      "Inspect \"Export\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.exportButton, "TP-BTN-MATCHED_ITEMS-06 Export on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-07",
      "Inspect \"pi pi-copy\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-MATCHED_ITEMS-07 pi pi-copy on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsView extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-08",
      "Inspect \"pi pi-eye\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.view, "TP-BTN-MATCHED_ITEMS-08 pi pi-eye on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-09",
      "Inspect \"Load more\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-MATCHED_ITEMS-09 Load more on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-10",
      "Inspect \"paginator:pi pi-angle-double-left\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-MATCHED_ITEMS-10 paginator:pi pi-angle-double-left on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-11",
      "Inspect \"paginator:pi pi-angle-left\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-MATCHED_ITEMS-11 paginator:pi pi-angle-left on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-12",
      "Inspect \"paginator:1\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-MATCHED_ITEMS-12 paginator:1 on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-13",
      "Inspect \"paginator:pi pi-angle-right\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-MATCHED_ITEMS-13 paginator:pi pi-angle-right on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS-14",
      "Inspect \"paginator:pi pi-angle-double-right\" on /matched-items",
      async (page) => {
        const pom = new MatchedItemsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-MATCHED_ITEMS-14 paginator:pi pi-angle-double-right on /matched-items");
      },
      "*****",
      "ready",
    );
  }
}

export class SaleUICheckIfMatchingDoneCorrectly extends TestPoint {
  constructor(expected: string) {
    super("TP", "Check if file matching done correctly", async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.expectOnPage();
      await pom.expectTableContains(expected, 2);
    });
  }
}
