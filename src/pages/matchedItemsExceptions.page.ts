import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class MatchedItemsExceptionsPage extends BasePage {
  static readonly path = "/matched-items/exceptions";
  static testPoints(): TestPoint[] {
    return [
      new OpenMatchedItemsExceptionsPage(),
      new InspectMatchedItemsExceptionsSettlementReconciliation(),
      new InspectMatchedItemsExceptionsDateRange(),
      new InspectMatchedItemsExceptionsSelectExceptionReasons(),
      new InspectMatchedItemsExceptionsSelectExceptionStatus(),
      new InspectMatchedItemsExceptionsSearch(),
    ];
  }

  readonly settlementReconciliation: Locator;
  readonly dateRange: Locator;
  readonly selectExceptionReasons: Locator;
  readonly selectExceptionStatus: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, MatchedItemsExceptionsPage.path);
    this.settlementReconciliation = this.findDropdown("Settlement Reconciliation");
    this.dateRange = this.findCalendarTrigger();
    this.selectExceptionReasons = this.findDropdown("Select exception reasons");
    this.selectExceptionStatus = this.findDropdown("Select exception status");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenMatchedItemsExceptionsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-MATCHED_ITEMS_EXCEPTIONS", "Open /matched-items/exceptions", async (page) => {
      const pom = new MatchedItemsExceptionsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectMatchedItemsExceptionsSettlementReconciliation extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-01",
      "Inspect \"Settlement Reconciliation\" on /matched-items/exceptions",
      async (page) => {
        const pom = new MatchedItemsExceptionsPage(page);
        await pom.expectVisible(pom.settlementReconciliation, "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-01 Settlement Reconciliation on /matched-items/exceptions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsExceptionsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-02",
      "Inspect \"pi pi-calendar\" on /matched-items/exceptions",
      async (page) => {
        const pom = new MatchedItemsExceptionsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-02 pi pi-calendar on /matched-items/exceptions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsExceptionsSelectExceptionReasons extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-03",
      "Inspect \"Select exception reasons\" on /matched-items/exceptions",
      async (page) => {
        const pom = new MatchedItemsExceptionsPage(page);
        await pom.expectVisible(pom.selectExceptionReasons, "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-03 Select exception reasons on /matched-items/exceptions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsExceptionsSelectExceptionStatus extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-04",
      "Inspect \"Select exception status\" on /matched-items/exceptions",
      async (page) => {
        const pom = new MatchedItemsExceptionsPage(page);
        await pom.expectVisible(pom.selectExceptionStatus, "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-04 Select exception status on /matched-items/exceptions");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectMatchedItemsExceptionsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-05",
      "Inspect \"Search\" on /matched-items/exceptions",
      async (page) => {
        const pom = new MatchedItemsExceptionsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-MATCHED_ITEMS_EXCEPTIONS-05 Search on /matched-items/exceptions");
      },
      "*****",
      "ready",
    );
  }
}

