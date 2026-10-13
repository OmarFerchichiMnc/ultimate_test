import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class AcquirersPage extends BasePage {
  static readonly path = "/acquirers";
  static testPoints(): TestPoint[] {
    return [
      new OpenAcquirersPage(),
      new InspectAcquirersSearch(),
      new InspectAcquirersCreate(),
      new InspectAcquirersCopy(),
      new InspectAcquirersEdit(),
      new InspectAcquirersPaginatorFirst(),
      new InspectAcquirersPaginatorPrev(),
      new InspectAcquirersPaginatorPage1(),
      new InspectAcquirersPaginatorNext(),
      new InspectAcquirersPaginatorLast(),
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
    super(page, AcquirersPage.path);
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

export class OpenAcquirersPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ACQUIRERS", "Open /acquirers", async (page) => {
      const pom = new AcquirersPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAcquirersSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-01",
      "Inspect \"Search\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ACQUIRERS-01 Search on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-02",
      "Inspect \"pi pi-plus\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-ACQUIRERS-02 pi pi-plus on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-03",
      "Inspect \"pi pi-copy\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-ACQUIRERS-03 pi pi-copy on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersEdit extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-04",
      "Inspect \"pi pi-pencil\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.edit, "TP-BTN-ACQUIRERS-04 pi pi-pencil on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-05",
      "Inspect \"paginator:pi pi-angle-double-left\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-ACQUIRERS-05 paginator:pi pi-angle-double-left on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-06",
      "Inspect \"paginator:pi pi-angle-left\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-ACQUIRERS-06 paginator:pi pi-angle-left on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-07",
      "Inspect \"paginator:1\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-ACQUIRERS-07 paginator:1 on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-12",
      "Inspect \"paginator:pi pi-angle-right\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-ACQUIRERS-12 paginator:pi pi-angle-right on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAcquirersPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACQUIRERS-13",
      "Inspect \"paginator:pi pi-angle-double-right\" on /acquirers",
      async (page) => {
        const pom = new AcquirersPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-ACQUIRERS-13 paginator:pi pi-angle-double-right on /acquirers");
      },
      "*****",
      "ready",
    );
  }
}

