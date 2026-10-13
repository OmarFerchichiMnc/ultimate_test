import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class PointOfSalesMerchantMappingPage extends BasePage {
  static readonly path = "/point-of-sales-merchant-mapping";
  static testPoints(): TestPoint[] {
    return [
      new OpenPointOfSalesMerchantMappingPage(),
      new InspectPointOfSalesMerchantMappingSelectSaleSource(),
      new InspectPointOfSalesMerchantMappingSearch(),
      new InspectPointOfSalesMerchantMappingCreate(),
      new InspectPointOfSalesMerchantMappingLoadMore(),
      new InspectPointOfSalesMerchantMappingPaginatorFirst(),
      new InspectPointOfSalesMerchantMappingPaginatorPrev(),
      new InspectPointOfSalesMerchantMappingPaginatorPage1(),
      new InspectPointOfSalesMerchantMappingPaginatorNext(),
      new InspectPointOfSalesMerchantMappingPaginatorLast(),
    ];
  }

  readonly selectSaleSource: Locator;
  readonly search: Locator;
  readonly create: Locator;
  readonly loadMore: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, PointOfSalesMerchantMappingPage.path);
    this.selectSaleSource = this.findDropdown("Select sale source");
    this.search = this.findNamedButton("Search", 0);
    this.create = this.findIconButton("pi-plus");
    this.loadMore = this.findNamedButton("Load more");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenPointOfSalesMerchantMappingPage extends TestPoint {
  constructor() {
    super("TP-OPEN-POINT_OF_SALES_MERCHANT_MAPPING", "Open /point-of-sales-merchant-mapping", async (page) => {
      const pom = new PointOfSalesMerchantMappingPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectPointOfSalesMerchantMappingSelectSaleSource extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-01",
      "Inspect \"Select sale source\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.selectSaleSource, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-01 Select sale source on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-02",
      "Inspect \"Search\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-02 Search on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-03",
      "Inspect \"pi pi-plus\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-03 pi pi-plus on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-04",
      "Inspect \"Load more\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-04 Load more on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-05",
      "Inspect \"paginator:pi pi-angle-double-left\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-05 paginator:pi pi-angle-double-left on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-06",
      "Inspect \"paginator:pi pi-angle-left\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-06 paginator:pi pi-angle-left on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-07",
      "Inspect \"paginator:1\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-07 paginator:1 on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-08",
      "Inspect \"paginator:pi pi-angle-right\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-08 paginator:pi pi-angle-right on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPointOfSalesMerchantMappingPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-09",
      "Inspect \"paginator:pi pi-angle-double-right\" on /point-of-sales-merchant-mapping",
      async (page) => {
        const pom = new PointOfSalesMerchantMappingPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-POINT_OF_SALES_MERCHANT_MAPPING-09 paginator:pi pi-angle-double-right on /point-of-sales-merchant-mapping");
      },
      "*****",
      "ready",
    );
  }
}

