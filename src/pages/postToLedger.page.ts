import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class PostToLedgerPage extends BasePage {
  static readonly path = "/post-to-ledger";
  static testPoints(): TestPoint[] {
    return [
      new OpenPostToLedgerPage(),
      new InspectPostToLedgerDateRange(),
      new InspectPostToLedgerGenerationStatus(),
      new InspectPostToLedgerSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly generationStatus: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, PostToLedgerPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.generationStatus = this.findDropdown("Generation Status");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenPostToLedgerPage extends TestPoint {
  constructor() {
    super("TP-OPEN-POST_TO_LEDGER", "Open /post-to-ledger", async (page) => {
      const pom = new PostToLedgerPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectPostToLedgerDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POST_TO_LEDGER-01",
      "Inspect \"pi pi-calendar\" on /post-to-ledger",
      async (page) => {
        const pom = new PostToLedgerPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-POST_TO_LEDGER-01 pi pi-calendar on /post-to-ledger");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPostToLedgerGenerationStatus extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POST_TO_LEDGER-02",
      "Inspect \"Generation Status\" on /post-to-ledger",
      async (page) => {
        const pom = new PostToLedgerPage(page);
        await pom.expectVisible(pom.generationStatus, "TP-BTN-POST_TO_LEDGER-02 Generation Status on /post-to-ledger");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectPostToLedgerSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-POST_TO_LEDGER-03",
      "Inspect \"Search\" on /post-to-ledger",
      async (page) => {
        const pom = new PostToLedgerPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-POST_TO_LEDGER-03 Search on /post-to-ledger");
      },
      "*****",
      "ready",
    );
  }
}

