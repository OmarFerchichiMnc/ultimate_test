import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class ImbalancedItemsPage extends BasePage {
  static readonly path = "/imbalanced-items";
  static testPoints(): TestPoint[] {
    return [
      new OpenImbalancedItemsPage(),
      new InspectImbalancedItemsDateRange(),
      new InspectImbalancedItemsSelectItemType(),
      new InspectImbalancedItemsSearch(),
    ];
  }

  readonly dateRange: Locator;
  readonly selectItemType: Locator;
  readonly search: Locator;

  constructor(page: Page) {
    super(page, ImbalancedItemsPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.selectItemType = this.findDropdown("Select item type");
    this.search = this.findNamedButton("Search", 0);
  }
}

export class OpenImbalancedItemsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-IMBALANCED_ITEMS", "Open /imbalanced-items", async (page) => {
      const pom = new ImbalancedItemsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectImbalancedItemsDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-IMBALANCED_ITEMS-01",
      "Inspect \"pi pi-calendar\" on /imbalanced-items",
      async (page) => {
        const pom = new ImbalancedItemsPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-IMBALANCED_ITEMS-01 pi pi-calendar on /imbalanced-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectImbalancedItemsSelectItemType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-IMBALANCED_ITEMS-02",
      "Inspect \"Select item type\" on /imbalanced-items",
      async (page) => {
        const pom = new ImbalancedItemsPage(page);
        await pom.expectVisible(pom.selectItemType, "TP-BTN-IMBALANCED_ITEMS-02 Select item type on /imbalanced-items");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectImbalancedItemsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-IMBALANCED_ITEMS-03",
      "Inspect \"Search\" on /imbalanced-items",
      async (page) => {
        const pom = new ImbalancedItemsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-IMBALANCED_ITEMS-03 Search on /imbalanced-items");
      },
      "*****",
      "ready",
    );
  }
}

