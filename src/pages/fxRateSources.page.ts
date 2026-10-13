import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class FxRateSourcesPage extends BasePage {
  static readonly path = "/fx-rate-sources";
  static testPoints(): TestPoint[] {
    return [
      new OpenFxRateSourcesPage(),
      new InspectFxRateSourcesSearch(),
      new InspectFxRateSourcesView(),
      new InspectFxRateSourcesPaginatorFirst(),
      new InspectFxRateSourcesPaginatorPrev(),
      new InspectFxRateSourcesPaginatorPage1(),
      new InspectFxRateSourcesPaginatorNext(),
      new InspectFxRateSourcesPaginatorLast(),
    ];
  }

  readonly search: Locator;
  readonly view: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, FxRateSourcesPage.path);
    this.search = this.findNamedButton("Search", 0);
    this.view = this.findIconButton("pi-eye");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenFxRateSourcesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-FX_RATE_SOURCES", "Open /fx-rate-sources", async (page) => {
      const pom = new FxRateSourcesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectFxRateSourcesSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-01",
      "Inspect \"Search\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-FX_RATE_SOURCES-01 Search on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFxRateSourcesView extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-02",
      "Inspect \"pi pi-eye\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.view, "TP-BTN-FX_RATE_SOURCES-02 pi pi-eye on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFxRateSourcesPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-03",
      "Inspect \"paginator:pi pi-angle-double-left\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-FX_RATE_SOURCES-03 paginator:pi pi-angle-double-left on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFxRateSourcesPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-04",
      "Inspect \"paginator:pi pi-angle-left\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-FX_RATE_SOURCES-04 paginator:pi pi-angle-left on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFxRateSourcesPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-05",
      "Inspect \"paginator:1\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-FX_RATE_SOURCES-05 paginator:1 on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFxRateSourcesPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-06",
      "Inspect \"paginator:pi pi-angle-right\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-FX_RATE_SOURCES-06 paginator:pi pi-angle-right on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFxRateSourcesPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FX_RATE_SOURCES-07",
      "Inspect \"paginator:pi pi-angle-double-right\" on /fx-rate-sources",
      async (page) => {
        const pom = new FxRateSourcesPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-FX_RATE_SOURCES-07 paginator:pi pi-angle-double-right on /fx-rate-sources");
      },
      "*****",
      "ready",
    );
  }
}

