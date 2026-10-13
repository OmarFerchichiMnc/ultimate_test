import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class FeeRulesPage extends BasePage {
  static readonly path = "/fee-rules";
  static testPoints(): TestPoint[] {
    return [
      new OpenFeeRulesPage(),
      new InspectFeeRulesAdyen(),
      new InspectFeeRulesSelectFeeRuleType(),
      new InspectFeeRulesSelectFeeRuleApplicationCondition(),
      new InspectFeeRulesSave(),
    ];
  }

  readonly adyen: Locator;
  readonly selectFeeRuleType: Locator;
  readonly selectFeeRuleApplicationCondition: Locator;
  readonly save: Locator;

  constructor(page: Page) {
    super(page, FeeRulesPage.path);
    this.adyen = this.findDropdown("adyen");
    this.selectFeeRuleType = this.findDropdown("Select fee rule type");
    this.selectFeeRuleApplicationCondition = this.findDropdown("Select fee rule application condition");
    this.save = this.findNamedButton("Save");
  }
}

export class OpenFeeRulesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-FEE_RULES", "Open /fee-rules", async (page) => {
      const pom = new FeeRulesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectFeeRulesAdyen extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FEE_RULES-01",
      "Inspect \"adyen\" on /fee-rules",
      async (page) => {
        const pom = new FeeRulesPage(page);
        await pom.expectVisible(pom.adyen, "TP-BTN-FEE_RULES-01 adyen on /fee-rules");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFeeRulesSelectFeeRuleType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FEE_RULES-02",
      "Inspect \"Select fee rule type\" on /fee-rules",
      async (page) => {
        const pom = new FeeRulesPage(page);
        await pom.expectVisible(pom.selectFeeRuleType, "TP-BTN-FEE_RULES-02 Select fee rule type on /fee-rules");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFeeRulesSelectFeeRuleApplicationCondition extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FEE_RULES-03",
      "Inspect \"Select fee rule application condition\" on /fee-rules",
      async (page) => {
        const pom = new FeeRulesPage(page);
        await pom.expectVisible(pom.selectFeeRuleApplicationCondition, "TP-BTN-FEE_RULES-03 Select fee rule application condition on /fee-rules");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFeeRulesSave extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FEE_RULES-04",
      "Inspect (do not click) \"Save\" on /fee-rules",
      async (page) => {
        const pom = new FeeRulesPage(page);
        await pom.expectVisible(pom.save, "TP-BTN-FEE_RULES-04 Save on /fee-rules");
        logger.info(`Skipping click for destructive control TP-BTN-FEE_RULES-04: Save`);
      },
      "*****",
      "inspect-only",
    );
  }
}

