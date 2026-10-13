import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class UnaccountedEventsPage extends BasePage {
  static readonly path = "/unaccounted-events";
  static testPoints(): TestPoint[] {
    return [
      new OpenUnaccountedEventsPage(),
      new InspectUnaccountedEventsDateRange(),
      new InspectUnaccountedEventsSelectEvents(),
      new InspectUnaccountedEventsSelectFailureReason(),
      new InspectUnaccountedEventsSearch(),
      new InspectUnaccountedEventsSelectItemType(),
      new InspectUnaccountedEventsOpenExternal(),
      new InspectUnaccountedEventsExportButton(),
      new InspectUnaccountedEventsCopy(),
      new InspectUnaccountedEventsLoadMore(),
      new InspectUnaccountedEventsPaginatorFirst(),
      new InspectUnaccountedEventsPaginatorPrev(),
      new InspectUnaccountedEventsPaginatorPage1(),
      new InspectUnaccountedEventsPaginatorNext(),
      new InspectUnaccountedEventsPaginatorLast(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectEvents: Locator;
  readonly selectFailureReason: Locator;
  readonly search: Locator;
  readonly selectItemType: Locator;
  readonly openExternal: Locator;
  readonly exportButton: Locator;
  readonly copy: Locator;
  readonly loadMore: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, UnaccountedEventsPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectEvents = this.findDropdown("Select events");
    this.selectFailureReason = this.findDropdown("Select failure reason");
    this.search = this.findNamedButton("Search", 0);
    this.selectItemType = this.findDropdown("Select item type");
    this.openExternal = this.page.getByRole("button").filter({ has: this.page.locator(".pi-external-link") });
    this.exportButton = this.findExportButton();
    this.copy = this.findCopyButton();
    this.loadMore = this.findNamedButton("Load more");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenUnaccountedEventsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-UNACCOUNTED_EVENTS", "Open /unaccounted-events", async (page) => {
      const pom = new UnaccountedEventsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectUnaccountedEventsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-01",
      "Inspect \"pi pi-calendar\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-UNACCOUNTED_EVENTS-01 pi pi-calendar on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsSelectEvents extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-02",
      "Inspect \"Select events\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.selectEvents, "TP-BTN-UNACCOUNTED_EVENTS-02 Select events on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsSelectFailureReason extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-03",
      "Inspect \"Select failure reason\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.selectFailureReason, "TP-BTN-UNACCOUNTED_EVENTS-03 Select failure reason on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-04",
      "Inspect \"Search\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-UNACCOUNTED_EVENTS-04 Search on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsSelectItemType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-05",
      "Inspect \"Select item type\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.selectItemType, "TP-BTN-UNACCOUNTED_EVENTS-05 Select item type on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsOpenExternal extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-06",
      "Inspect \"pi pi-external-link\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.openExternal, "TP-BTN-UNACCOUNTED_EVENTS-06 pi pi-external-link on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsExportButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-07",
      "Inspect \"Export\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.exportButton, "TP-BTN-UNACCOUNTED_EVENTS-07 Export on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-08",
      "Inspect \"pi pi-copy\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-UNACCOUNTED_EVENTS-08 pi pi-copy on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-09",
      "Inspect \"Load more\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-UNACCOUNTED_EVENTS-09 Load more on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-10",
      "Inspect \"paginator:pi pi-angle-double-left\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-UNACCOUNTED_EVENTS-10 paginator:pi pi-angle-double-left on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-11",
      "Inspect \"paginator:pi pi-angle-left\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-UNACCOUNTED_EVENTS-11 paginator:pi pi-angle-left on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-12",
      "Inspect \"paginator:1\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-UNACCOUNTED_EVENTS-12 paginator:1 on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-13",
      "Inspect \"paginator:pi pi-angle-right\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-UNACCOUNTED_EVENTS-13 paginator:pi pi-angle-right on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectUnaccountedEventsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-UNACCOUNTED_EVENTS-14",
      "Inspect \"paginator:pi pi-angle-double-right\" on /unaccounted-events",
      async (page) => {
        const pom = new UnaccountedEventsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-UNACCOUNTED_EVENTS-14 paginator:pi pi-angle-double-right on /unaccounted-events");
      },
      "*****",
      "ready",
    );
  }
}

