import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";

export class FormOfPaymentsPage extends BasePage {
  static readonly path = "/form-of-payments";
  static testPoints(): TestPoint[] {
    return [
      new OpenFormOfPaymentsPage(),
      new InspectFormOfPaymentsSelectFopType(),
      new InspectFormOfPaymentsSearch(),
      new InspectFormOfPaymentsCreate(),
      new InspectFormOfPaymentsCopy(),
      new InspectFormOfPaymentsEdit(),
      new InspectFormOfPaymentsPaginatorFirst(),
      new InspectFormOfPaymentsPaginatorPrev(),
      new InspectFormOfPaymentsPaginatorPage1(),
      new InspectFormOfPaymentsPaginatorNext(),
      new InspectFormOfPaymentsPaginatorLast(),
    ];
  }

  readonly selectFopType: Locator;
  readonly search: Locator;
  readonly create: Locator;
  readonly copy: Locator;
  readonly edit: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;

  constructor(page: Page) {
    super(page, FormOfPaymentsPage.path);
    this.selectFopType = this.findDropdown("Select FOP Type");
    this.search = this.findNamedButton("Search", 0);
    this.create = this.findIconButton("pi-plus");
    this.copy = this.findCopyButton();
    this.edit = this.findIconButton("pi-pencil");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
  }
}

export class OpenFormOfPaymentsPage extends TestPoint {
  constructor() {
    super("TP-OPEN-FORM_OF_PAYMENTS", "Open /form-of-payments", async (page) => {
      const pom = new FormOfPaymentsPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectFormOfPaymentsSelectFopType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-01",
      "Inspect \"Select FOP Type\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.selectFopType, "TP-BTN-FORM_OF_PAYMENTS-01 Select FOP Type on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-02",
      "Inspect \"Search\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-FORM_OF_PAYMENTS-02 Search on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsCreate extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-03",
      "Inspect \"pi pi-plus\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.create, "TP-BTN-FORM_OF_PAYMENTS-03 pi pi-plus on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-04",
      "Inspect \"pi pi-copy\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-FORM_OF_PAYMENTS-04 pi pi-copy on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsEdit extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-05",
      "Inspect \"pi pi-pencil\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.edit, "TP-BTN-FORM_OF_PAYMENTS-05 pi pi-pencil on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-06",
      "Inspect \"paginator:pi pi-angle-double-left\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-FORM_OF_PAYMENTS-06 paginator:pi pi-angle-double-left on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-07",
      "Inspect \"paginator:pi pi-angle-left\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-FORM_OF_PAYMENTS-07 paginator:pi pi-angle-left on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-08",
      "Inspect \"paginator:1\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-FORM_OF_PAYMENTS-08 paginator:1 on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-12",
      "Inspect \"paginator:pi pi-angle-right\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-FORM_OF_PAYMENTS-12 paginator:pi pi-angle-right on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFormOfPaymentsPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-FORM_OF_PAYMENTS-13",
      "Inspect \"paginator:pi pi-angle-double-right\" on /form-of-payments",
      async (page) => {
        const pom = new FormOfPaymentsPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-FORM_OF_PAYMENTS-13 paginator:pi pi-angle-double-right on /form-of-payments");
      },
      "*****",
      "ready",
    );
  }
}

