import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class SecondaryMatchingRulesPage extends BasePage {
  static readonly path = "/matching-rules/secondary-matching";
  static testPoints(): TestPoint[] {
    return [
      new OpenSecondaryMatchingRulesPage(),
      new InspectSecondaryMatchingRulesList(),
      new InspectSecondaryMatchingRulesPaginatorFirst(),
      new InspectSecondaryMatchingRulesPaginatorPrev(),
      new InspectSecondaryMatchingRulesPaginatorPage1(),
      new InspectSecondaryMatchingRulesPaginatorNext(),
      new InspectSecondaryMatchingRulesPaginatorLast(),
    ];
  }

  readonly list: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, SecondaryMatchingRulesPage.path);
    this.list = this.findIconButton("pi-list");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenSecondaryMatchingRulesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-MATCHING_RULES_SECONDARY_MATCHING", "Open /matching-rules/secondary-matching", async (page) => {
      const pom = new SecondaryMatchingRulesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSecondaryMatchingRulesList extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-01",
      "Inspect \"pi pi-list\" on /matching-rules/secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingRulesPage(page);
        await pom.expectVisible(pom.list, "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-01 pi pi-list on /matching-rules/secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingRulesPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-02",
      "Inspect \"paginator:pi pi-angle-double-left\" on /matching-rules/secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingRulesPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-02 paginator:pi pi-angle-double-left on /matching-rules/secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingRulesPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-03",
      "Inspect \"paginator:pi pi-angle-left\" on /matching-rules/secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingRulesPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-03 paginator:pi pi-angle-left on /matching-rules/secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingRulesPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-04",
      "Inspect \"paginator:1\" on /matching-rules/secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingRulesPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-04 paginator:1 on /matching-rules/secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingRulesPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-05",
      "Inspect \"paginator:pi pi-angle-right\" on /matching-rules/secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingRulesPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-05 paginator:pi pi-angle-right on /matching-rules/secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSecondaryMatchingRulesPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-06",
      "Inspect \"paginator:pi pi-angle-double-right\" on /matching-rules/secondary-matching",
      async (page) => {
        const pom = new SecondaryMatchingRulesPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-MATCHING_RULES_SECONDARY_MATCHING-06 paginator:pi pi-angle-double-right on /matching-rules/secondary-matching");
      },
      "*****",
      "ready",
    );
  }
}

