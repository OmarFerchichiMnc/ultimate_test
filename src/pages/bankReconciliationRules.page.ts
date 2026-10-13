import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class BankReconciliationRulesPage extends BasePage {
  static readonly path = "/matching-rules/bank-reconciliation";
  static testPoints(): TestPoint[] {
    return [
      new OpenBankReconciliationRulesPage(),
      new InspectBankReconciliationRulesList(),
    ];
  }

  readonly list: Locator;

  constructor(page: Page) {
    super(page, BankReconciliationRulesPage.path);
    this.list = this.findIconButton("pi-list");
  }
}

export class OpenBankReconciliationRulesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-MATCHING_RULES_BANK_RECONCILIATION", "Open /matching-rules/bank-reconciliation", async (page) => {
      const pom = new BankReconciliationRulesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectBankReconciliationRulesList extends TestPoint {
  constructor() {
    super(
      "TP-BTN-MATCHING_RULES_BANK_RECONCILIATION-01",
      "Inspect \"pi pi-list\" on /matching-rules/bank-reconciliation",
      async (page) => {
        const pom = new BankReconciliationRulesPage(page);
        await pom.expectVisible(pom.list, "TP-BTN-MATCHING_RULES_BANK_RECONCILIATION-01 pi pi-list on /matching-rules/bank-reconciliation");
      },
      "*****",
      "ready",
    );
  }
}

