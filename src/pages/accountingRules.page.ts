import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";

export class AccountingRulesPage extends BasePage {
  static readonly path = "/accounting-rules";
  static testPoints(): TestPoint[] {
    return [
      new OpenAccountingRulesPage(),
      new InspectAccountingRulesUpload(),
      new InspectAccountingRulesSearch(),
      new InspectAccountingRulesFillBalanceTransferTypes(),
      new InspectAccountingRulesCreate(),
    ];
  }

  readonly upload: Locator;
  readonly search: Locator;
  readonly fillBalanceTransferTypes: Locator;
  readonly create: Locator;

  constructor(page: Page) {
    super(page, AccountingRulesPage.path);
    this.upload = this.page.getByRole("button", { name: /choose|upload/i }).or(this.page.locator(".p-fileupload-choose"));
    this.search = this.findNamedButton("Search", 0);
    this.fillBalanceTransferTypes = this.findDropdown("Fill Balance Transfer Types");
    this.create = this.findIconButton("pi-plus");
  }
}

export class OpenAccountingRulesPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ACCOUNTING_RULES", "Open /accounting-rules", async (page) => {
      const pom = new AccountingRulesPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectAccountingRulesUpload extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_RULES-01",
      "Inspect (do not click) \"Upload\" on /accounting-rules",
      async (page) => {
        const pom = new AccountingRulesPage(page);
        await pom.expectVisible(pom.upload, "TP-BTN-ACCOUNTING_RULES-01 Upload on /accounting-rules");
        logger.info(`Skipping click for destructive control TP-BTN-ACCOUNTING_RULES-01: Upload`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectAccountingRulesSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_RULES-02",
      "Inspect \"Search\" on /accounting-rules",
      async (page) => {
        const pom = new AccountingRulesPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ACCOUNTING_RULES-02 Search on /accounting-rules");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingRulesFillBalanceTransferTypes extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_RULES-03",
      "Inspect \"Fill Balance Transfer Types\" on /accounting-rules",
      async (page) => {
        const pom = new AccountingRulesPage(page);
        await pom.expectVisible(pom.fillBalanceTransferTypes, "TP-BTN-ACCOUNTING_RULES-03 Fill Balance Transfer Types on /accounting-rules");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectAccountingRulesCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ACCOUNTING_RULES-04",
      "Inspect \"pi pi-plus\" on /accounting-rules",
      async (page) => {
        const pom = new AccountingRulesPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-ACCOUNTING_RULES-04 pi pi-plus on /accounting-rules");
      },
      "*****",
      "ready",
    );
  }
}

