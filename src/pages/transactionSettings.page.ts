import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class TransactionSettingsPage extends BasePage {
  static readonly path = "/settings/transaction";
  static testPoints(): TestPoint[] {
    return [
      new OpenTransactionSettingsPage(),
      new InspectTransactionSettingsAcquirer(),
      new InspectTransactionSettingsAdyen(),
      new InspectTransactionSettingsSelectAMarket(),
      new InspectTransactionSettingsCopy(),
      new InspectTransactionSettingsEdit(),
      new InspectTransactionSettingsPaginatorFirst(),
      new InspectTransactionSettingsPaginatorPrev(),
      new InspectTransactionSettingsPaginatorPage1(),
      new InspectTransactionSettingsPaginatorNext(),
      new InspectTransactionSettingsPaginatorLast(),
      new InspectTransactionSettingsCreate(),
    ];
  }

  readonly acquirer: Locator;
  readonly adyen: Locator;
  readonly selectAMarket: Locator;
  readonly copy: Locator;
  readonly edit: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;
  readonly create: Locator;

  constructor(page: Page) {
    super(page, TransactionSettingsPage.path);
    this.acquirer = this.findDropdown("Acquirer");
    this.adyen = this.findDropdown("adyen");
    this.selectAMarket = this.findDropdown("Select a market");
    this.copy = this.findCopyButton();
    this.edit = this.findIconButton("pi-pencil");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
    this.create = this.findIconButton("pi-plus");
  }
}

export class OpenTransactionSettingsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-SETTINGS_TRANSACTION", "Open /settings/transaction", async (page) => {
      const pom = new TransactionSettingsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectTransactionSettingsAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-01",
      "Inspect \"Acquirer\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.acquirer, "TP-BTN-SETTINGS_TRANSACTION-01 Acquirer on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsAdyen extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-02",
      "Inspect \"adyen\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.adyen, "TP-BTN-SETTINGS_TRANSACTION-02 adyen on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsSelectAMarket extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-03",
      "Inspect \"Select a market\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.selectAMarket, "TP-BTN-SETTINGS_TRANSACTION-03 Select a market on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-04",
      "Inspect \"pi pi-copy\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-SETTINGS_TRANSACTION-04 pi pi-copy on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsEdit extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-05",
      "Inspect \"pi pi-pencil\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.edit, "TP-BTN-SETTINGS_TRANSACTION-05 pi pi-pencil on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-06",
      "Inspect \"paginator:pi pi-angle-double-left\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-SETTINGS_TRANSACTION-06 paginator:pi pi-angle-double-left on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-07",
      "Inspect \"paginator:pi pi-angle-left\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-SETTINGS_TRANSACTION-07 paginator:pi pi-angle-left on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-08",
      "Inspect \"paginator:1\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-SETTINGS_TRANSACTION-08 paginator:1 on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-09",
      "Inspect \"paginator:pi pi-angle-right\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-SETTINGS_TRANSACTION-09 paginator:pi pi-angle-right on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-10",
      "Inspect \"paginator:pi pi-angle-double-right\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-SETTINGS_TRANSACTION-10 paginator:pi pi-angle-double-right on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectTransactionSettingsCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-SETTINGS_TRANSACTION-12",
      "Inspect \"pi pi-plus\" on /settings/transaction",
      async (page) => {
        const pom = new TransactionSettingsPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-SETTINGS_TRANSACTION-12 pi pi-plus on /settings/transaction");
      },
      "*****",
      "ready",
    );
  }
}

