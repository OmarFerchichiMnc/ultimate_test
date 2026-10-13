import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class SaleSourcesPage extends BasePage {
  static readonly path = "/sale-sources";
  static testPoints(): TestPoint[] {
    return [
      new OpenSaleSourcesPage(),
      new InspectSaleSourcesSearch(),
      new InspectSaleSourcesCreate(),
      new InspectSaleSourcesCopy(),
      new InspectSaleSourcesEdit(),
      new InspectSaleSourcesPaginatorFirst(),
      new InspectSaleSourcesPaginatorPrev(),
      new InspectSaleSourcesPaginatorPage1(),
      new InspectSaleSourcesPaginatorNext(),
      new InspectSaleSourcesPaginatorLast(),
    ];
  }

  readonly search: Locator;
  readonly create: Locator;
  readonly copy: Locator;
  readonly edit: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, SaleSourcesPage.path);
    this.search = this.findNamedButton("Search", 0);
    this.create = this.findIconButton("pi-plus");
    this.copy = this.findCopyButton();
    this.edit = this.findIconButton("pi-pencil");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenSaleSourcesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SALE_SOURCES", "Open /sale-sources", async (page) => {
      const pom = new SaleSourcesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSaleSourcesSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-01",
      "Inspect \"Search\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-SALE_SOURCES-01 Search on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-02",
      "Inspect \"pi pi-plus\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-SALE_SOURCES-02 pi pi-plus on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-03",
      "Inspect \"pi pi-copy\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-SALE_SOURCES-03 pi pi-copy on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesEdit extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-04",
      "Inspect \"pi pi-pencil\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.edit, "TP-BTN-SALE_SOURCES-04 pi pi-pencil on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-05",
      "Inspect \"paginator:pi pi-angle-double-left\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-SALE_SOURCES-05 paginator:pi pi-angle-double-left on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-06",
      "Inspect \"paginator:pi pi-angle-left\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-SALE_SOURCES-06 paginator:pi pi-angle-left on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-07",
      "Inspect \"paginator:1\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-SALE_SOURCES-07 paginator:1 on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-09",
      "Inspect \"paginator:pi pi-angle-right\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-SALE_SOURCES-09 paginator:pi pi-angle-right on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleSourcesPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SALE_SOURCES-10",
      "Inspect \"paginator:pi pi-angle-double-right\" on /sale-sources",
      async (page) => {
        const pom = new SaleSourcesPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-SALE_SOURCES-10 paginator:pi pi-angle-double-right on /sale-sources");
      },
      "*****",
      "ready",
    );
  }
}

