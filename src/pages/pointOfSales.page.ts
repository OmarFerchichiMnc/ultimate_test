import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class PointOfSalesPage extends BasePage {
  static readonly path = "/point-of-sales";
  static testPoints(): TestPoint[] {
    return [
      new OpenPointOfSalesPage(),
      new InspectPointOfSalesSelectSaleSource(),
      new InspectPointOfSalesSearch(),
      new InspectPointOfSalesCreate(),
      new InspectPointOfSalesList(),
      new InspectPointOfSalesLoadMore(),
      new InspectPointOfSalesPaginatorFirst(),
      new InspectPointOfSalesPaginatorPrev(),
      new InspectPointOfSalesPaginatorPage1(),
      new InspectPointOfSalesPaginatorNext(),
      new InspectPointOfSalesPaginatorLast(),
    ];
  }

  readonly selectSaleSource: Locator;
  readonly search: Locator;
  readonly create: Locator;
  readonly list: Locator;
  readonly loadMore: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, PointOfSalesPage.path);
    this.selectSaleSource = this.findDropdown("Select sale source");
    this.search = this.findNamedButton("Search", 0);
    this.create = this.findIconButton("pi-plus");
    this.list = this.findIconButton("pi-list");
    this.loadMore = this.findNamedButton("Load more");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenPointOfSalesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-POINT_OF_SALES", "Open /point-of-sales", async (page) => {
      const pom = new PointOfSalesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectPointOfSalesSelectSaleSource extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-01",
      "Inspect \"Select sale source\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.selectSaleSource, "TP-BTN-POINT_OF_SALES-01 Select sale source on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-02",
      "Inspect \"Search\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-POINT_OF_SALES-02 Search on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-03",
      "Inspect \"pi pi-plus\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-POINT_OF_SALES-03 pi pi-plus on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesList extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-04",
      "Inspect \"pi pi-list\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.list, "TP-BTN-POINT_OF_SALES-04 pi pi-list on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-05",
      "Inspect \"Load more\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-POINT_OF_SALES-05 Load more on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-06",
      "Inspect \"paginator:pi pi-angle-double-left\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-POINT_OF_SALES-06 paginator:pi pi-angle-double-left on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-07",
      "Inspect \"paginator:pi pi-angle-left\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-POINT_OF_SALES-07 paginator:pi pi-angle-left on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-08",
      "Inspect \"paginator:1\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-POINT_OF_SALES-08 paginator:1 on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-09",
      "Inspect \"paginator:pi pi-angle-right\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-POINT_OF_SALES-09 paginator:pi pi-angle-right on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES-10",
      "Inspect \"paginator:pi pi-angle-double-right\" on /point-of-sales",
      async (page) => {
        const pom = new PointOfSalesPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-POINT_OF_SALES-10 paginator:pi pi-angle-double-right on /point-of-sales");
      },
      "*****",
      "ready",
    );
  }
}

