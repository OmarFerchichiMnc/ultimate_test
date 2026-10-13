import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class SettlementReconciliationRulesPage extends BasePage {
  static readonly path = "/matching-rules/settlement-reconciliation";
  static testPoints(): TestPoint[] {
    return [
      new OpenSettlementReconciliationRulesPage(),
      new InspectSettlementReconciliationRulesList(),
      new InspectSettlementReconciliationRulesPaginatorFirst(),
      new InspectSettlementReconciliationRulesPaginatorPrev(),
      new InspectSettlementReconciliationRulesPaginatorPage1(),
      new InspectSettlementReconciliationRulesPaginatorNext(),
      new InspectSettlementReconciliationRulesPaginatorLast(),
    ];
  }

  readonly list: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, SettlementReconciliationRulesPage.path);
    this.list = this.findIconButton("pi-list");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenSettlementReconciliationRulesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-MATCHING_RULES_SETTLEMENT_RECONCILIATION", "Open /matching-rules/settlement-reconciliation", async (page) => {
      const pom = new SettlementReconciliationRulesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSettlementReconciliationRulesList extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-01",
      "Inspect \"pi pi-list\" on /matching-rules/settlement-reconciliation",
      async (page) => {
        const pom = new SettlementReconciliationRulesPage(page);
        await pom.expectVisible(pom.list, "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-01 pi pi-list on /matching-rules/settlement-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementReconciliationRulesPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-02",
      "Inspect \"paginator:pi pi-angle-double-left\" on /matching-rules/settlement-reconciliation",
      async (page) => {
        const pom = new SettlementReconciliationRulesPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-02 paginator:pi pi-angle-double-left on /matching-rules/settlement-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementReconciliationRulesPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-03",
      "Inspect \"paginator:pi pi-angle-left\" on /matching-rules/settlement-reconciliation",
      async (page) => {
        const pom = new SettlementReconciliationRulesPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-03 paginator:pi pi-angle-left on /matching-rules/settlement-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementReconciliationRulesPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-04",
      "Inspect \"paginator:1\" on /matching-rules/settlement-reconciliation",
      async (page) => {
        const pom = new SettlementReconciliationRulesPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-04 paginator:1 on /matching-rules/settlement-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementReconciliationRulesPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-05",
      "Inspect \"paginator:pi pi-angle-right\" on /matching-rules/settlement-reconciliation",
      async (page) => {
        const pom = new SettlementReconciliationRulesPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-05 paginator:pi pi-angle-right on /matching-rules/settlement-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementReconciliationRulesPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-06",
      "Inspect \"paginator:pi pi-angle-double-right\" on /matching-rules/settlement-reconciliation",
      async (page) => {
        const pom = new SettlementReconciliationRulesPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-MATCHING_RULES_SETTLEMENT_RECONCILIATION-06 paginator:pi pi-angle-double-right on /matching-rules/settlement-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

