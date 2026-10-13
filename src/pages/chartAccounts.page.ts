import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class ChartAccountsPage extends BasePage {
  static readonly path = "/chart-accounts";
  static testPoints(): TestPoint[] {
    return [
      new OpenChartAccountsPage(),
      new InspectChartAccountsCreate(),
      new InspectChartAccountsCopy(),
      new InspectChartAccountsEdit(),
      new InspectChartAccountsPaginatorFirst(),
      new InspectChartAccountsPaginatorPrev(),
      new InspectChartAccountsPaginatorPage1(),
      new InspectChartAccountsPaginatorNext(),
      new InspectChartAccountsPaginatorLast(),
    ];
  }

  readonly create: Locator;
  readonly copy: Locator;
  readonly edit: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, ChartAccountsPage.path);
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

export class OpenChartAccountsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-CHART_ACCOUNTS", "Open /chart-accounts", async (page) => {
      const pom = new ChartAccountsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectChartAccountsCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-01",
      "Inspect \"pi pi-plus\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-CHART_ACCOUNTS-01 pi pi-plus on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-02",
      "Inspect \"pi pi-copy\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-CHART_ACCOUNTS-02 pi pi-copy on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsEdit extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-03",
      "Inspect \"pi pi-pencil\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.edit, "TP-BTN-CHART_ACCOUNTS-03 pi pi-pencil on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-04",
      "Inspect \"paginator:pi pi-angle-double-left\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-CHART_ACCOUNTS-04 paginator:pi pi-angle-double-left on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-05",
      "Inspect \"paginator:pi pi-angle-left\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-CHART_ACCOUNTS-05 paginator:pi pi-angle-left on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-06",
      "Inspect \"paginator:1\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-CHART_ACCOUNTS-06 paginator:1 on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-10",
      "Inspect \"paginator:pi pi-angle-right\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-CHART_ACCOUNTS-10 paginator:pi pi-angle-right on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectChartAccountsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-CHART_ACCOUNTS-11",
      "Inspect \"paginator:pi pi-angle-double-right\" on /chart-accounts",
      async (page) => {
        const pom = new ChartAccountsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-CHART_ACCOUNTS-11 paginator:pi pi-angle-double-right on /chart-accounts");
      },
      "*****",
      "ready",
    );
  }
}

