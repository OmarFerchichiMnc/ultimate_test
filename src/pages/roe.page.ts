import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class RoePage extends BasePage {
  static readonly path = "/roe";
  static testPoints(): TestPoint[] {
    return [
      new OpenRoePage(),
      new InspectRoeDateRange(),
      new InspectRoeFromGlobalCurrencyTab(),
      new InspectRoeToGlobalCurrencyTab(),
      new InspectRoeSearch(),
      new InspectRoePaginatorFirst(),
      new InspectRoePaginatorPrev(),
      new InspectRoePaginatorPage1(),
      new InspectRoePaginatorNext(),
      new InspectRoePaginatorLast(),
    ];
  }

  readonly dateRange: Locator;
  readonly fromGlobalCurrencyTab: Locator;
  readonly toGlobalCurrencyTab: Locator;
  readonly search: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, RoePage.path);
    this.dateRange = this.findCalendarTrigger();
    this.fromGlobalCurrencyTab = this.findTab("From global currency");
    this.toGlobalCurrencyTab = this.findTab("To global currency");
    this.search = this.findNamedButton("Search", 0);
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenRoePage extends TestPoint {
  constructor() {
    super("TP-OPEN-ROE", "Open /roe", async (page) => {
      const pom = new RoePage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectRoeDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-01",
      "Inspect \"pi pi-calendar\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-ROE-01 pi pi-calendar on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoeFromGlobalCurrencyTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-02",
      "Inspect \"From global currency\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.fromGlobalCurrencyTab, "TP-BTN-ROE-02 From global currency on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoeToGlobalCurrencyTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-03",
      "Inspect \"To global currency\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.toGlobalCurrencyTab, "TP-BTN-ROE-03 To global currency on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoeSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-04",
      "Inspect \"Search\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ROE-04 Search on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoePaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-05",
      "Inspect \"paginator:pi pi-angle-double-left\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-ROE-05 paginator:pi pi-angle-double-left on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoePaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-06",
      "Inspect \"paginator:pi pi-angle-left\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-ROE-06 paginator:pi pi-angle-left on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoePaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-07",
      "Inspect \"paginator:1\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-ROE-07 paginator:1 on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoePaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-11",
      "Inspect \"paginator:pi pi-angle-right\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-ROE-11 paginator:pi pi-angle-right on /roe");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectRoePaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ROE-12",
      "Inspect \"paginator:pi pi-angle-double-right\" on /roe",
      async (page) => {
        const pom = new RoePage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-ROE-12 paginator:pi pi-angle-double-right on /roe");
      },
      "*****",
      "ready",
    );
  }
}

