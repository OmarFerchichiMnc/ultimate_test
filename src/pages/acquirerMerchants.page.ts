import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class AcquirerMerchantsPage extends BasePage {
  static readonly path = "/acquirer-merchants";
  static testPoints(): TestPoint[] {
    return [
      new OpenAcquirerMerchantsPage(),
      new InspectAcquirerMerchantsSelectCustomerAcquirer(),
      new InspectAcquirerMerchantsSelectMarket(),
      new InspectAcquirerMerchantsSearch(),
      new InspectAcquirerMerchantsCreate(),
      new InspectAcquirerMerchantsList(),
      new InspectAcquirerMerchantsLoadMore(),
      new InspectAcquirerMerchantsPaginatorFirst(),
      new InspectAcquirerMerchantsPaginatorPrev(),
      new InspectAcquirerMerchantsPaginatorPage1(),
      new InspectAcquirerMerchantsPaginatorNext(),
      new InspectAcquirerMerchantsPaginatorLast(),
    ];
  }

  readonly selectCustomerAcquirer: Locator;
  readonly selectMarket: Locator;
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
    super(page, AcquirerMerchantsPage.path);
    this.selectCustomerAcquirer = this.findDropdown("Select Customer/Acquirer");
    this.selectMarket = this.findDropdown("Select market");
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

export class OpenAcquirerMerchantsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ACQUIRER_MERCHANTS", "Open /acquirer-merchants", async (page) => {
      const pom = new AcquirerMerchantsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAcquirerMerchantsSelectCustomerAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-01",
      "Inspect \"Select Customer/Acquirer\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.selectCustomerAcquirer, "TP-BTN-ACQUIRER_MERCHANTS-01 Select Customer/Acquirer on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsSelectMarket extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-02",
      "Inspect \"Select market\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.selectMarket, "TP-BTN-ACQUIRER_MERCHANTS-02 Select market on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-03",
      "Inspect \"Search\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ACQUIRER_MERCHANTS-03 Search on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-04",
      "Inspect \"pi pi-plus\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-ACQUIRER_MERCHANTS-04 pi pi-plus on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsList extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-05",
      "Inspect \"pi pi-list\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.list, "TP-BTN-ACQUIRER_MERCHANTS-05 pi pi-list on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-06",
      "Inspect \"Load more\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-ACQUIRER_MERCHANTS-06 Load more on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-07",
      "Inspect \"paginator:pi pi-angle-double-left\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-ACQUIRER_MERCHANTS-07 paginator:pi pi-angle-double-left on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-08",
      "Inspect \"paginator:pi pi-angle-left\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-ACQUIRER_MERCHANTS-08 paginator:pi pi-angle-left on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-09",
      "Inspect \"paginator:1\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-ACQUIRER_MERCHANTS-09 paginator:1 on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-10",
      "Inspect \"paginator:pi pi-angle-right\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-ACQUIRER_MERCHANTS-10 paginator:pi pi-angle-right on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirerMerchantsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRER_MERCHANTS-11",
      "Inspect \"paginator:pi pi-angle-double-right\" on /acquirer-merchants",
      async (page) => {
        const pom = new AcquirerMerchantsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-ACQUIRER_MERCHANTS-11 paginator:pi pi-angle-double-right on /acquirer-merchants");
      },
      "*****",
      "ready",
    );
  }
}

