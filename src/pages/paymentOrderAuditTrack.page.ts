import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { assignedFileId, looksLikeFileName } from "./scenarioSupport";

export class PaymentOrderAuditTrackPage extends BasePage {
  static readonly path = "/audit-track/settlement";

  readonly host: Locator;
  readonly paymentOrderTab: Locator;
  readonly search: Locator;
  readonly extraFiltersButton: Locator;
  readonly quickFilter: Locator;
  readonly quickSearchInput: Locator;
  readonly quickSearchButton: Locator;
  readonly paymentDateInput: Locator;
  readonly selectCustomerAcquirer: Locator;
  readonly paymentOrderReference: Locator;
  readonly bankDepositReference: Locator;
  readonly fileIdInput: Locator;
  readonly bankedStatus: Locator;

  constructor(page: Page) {
    super(page, PaymentOrderAuditTrackPage.path);
    this.host = this.page.locator("adad-frontend-payment-orders-audit-track");
    this.paymentOrderTab = this.page.getByRole("button", { name: "Payment Order", exact: true });
    this.search = this.host
      .locator("p-card")
      .filter({ has: this.page.getByRole("heading", { name: "Advanced Filters" }) })
      .getByRole("button", { name: "Search" });
    this.extraFiltersButton = this.host.getByRole("button").filter({ has: this.page.locator(".pi-filter") });
    this.quickFilter = this.host.locator("adad-frontend-quick-search-standalone-filter");
    this.quickSearchInput = this.quickFilter.getByRole("textbox", { name: /enter payment order id/i });
    this.quickSearchButton = this.quickFilter.getByRole("button", { name: "Search" });
    this.paymentDateInput = this.host.getByPlaceholder("Select payment order date range");
    this.selectCustomerAcquirer = this.host
      .locator("p-dropdown, p-multiselect")
      .filter({ has: this.page.getByPlaceholder("Select Customer/Acquirer", { exact: true }) });
    this.paymentOrderReference = this.host.getByPlaceholder("Payment Order Reference", { exact: true });
    this.bankDepositReference = this.host.getByPlaceholder("Bank Deposit Reference", { exact: true });
    this.fileIdInput = this.host.getByPlaceholder("File ID", { exact: true });
    this.bankedStatus = this.host
      .locator("p-dropdown, p-multiselect")
      .filter({ has: this.page.getByPlaceholder("Select Banked Status", { exact: true }) });
  }

  async goto(): Promise<void> {
    await super.goto();
    await this.paymentOrderTab.click();
    await expect(this.host).toBeVisible();
  }

  async clearQuickFilter(): Promise<void> {
    const boxes = this.quickFilter.getByRole("textbox");
    const count = await boxes.count();
    for (let i = 0; i < count; i += 1) {
      const box = boxes.nth(i);
      if (await box.isVisible()) {
        await box.fill("");
      }
    }
    await expect(this.quickSearchInput).toHaveValue("");
    logger.info("Payment order quick filter is empty");
  }
}

export class OpenPaymentOrderAuditTrackPage extends TestPoint {
  constructor() {
    super("TP-OPEN-AUDIT_TRACK_PAYMENT_ORDER", "Open payment order audit track", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.goto();
      await pom.expectOnPage();
      await expect(pom.host).toBeVisible();
    });
  }
}

export class PaymentOrderUIFilterPaymentOrderID extends TestPoint {
  constructor(id: string) {
    super("TP", `Filter payment order id ${id}`, async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.quickSearchInput.fill(String(id));
    });
  }
}

export class PaymentOrderUIClickSearchQuickFilter extends TestPoint {
  constructor() {
    super("TP", "click payment order quick search", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await expect(pom.quickSearchButton).toBeEnabled();
      await pom.quickSearchButton.click();
    });
  }
}

export class PaymentOrderUIFilterPaymentOrderDateRange extends TestPoint {
  constructor(date: string) {
    super("TP", "Filter payment order date range", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.fillDateRange(pom.paymentDateInput, date);
    });
  }
}

export class PaymentOrderUIFilterCustomerAcquirer extends TestPoint {
  constructor(acquirer: string) {
    super("TP", "Filter payment order customer acquirer", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.selectCustomerAcquirer, acquirer);
    });
  }
}

export class PaymentOrderUIFilterPaymentOrderReference extends TestPoint {
  constructor(reference: string) {
    super("TP", "Filter payment order reference", async (page) => {
      if (!reference) return;
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.paymentOrderReference.fill(reference);
    });
  }
}

export class PaymentOrderUIFilterBankDepositReference extends TestPoint {
  constructor(reference: string) {
    super("TP", "Filter payment order bank deposit reference", async (page) => {
      if (!reference) return;
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.bankDepositReference.fill(reference);
    });
  }
}

export class PaymentOrderUIAddFilters extends TestPoint {
  constructor() {
    super("TP", "Click payment order add filter", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      if (await pom.bankedStatus.isVisible().catch(() => false)) {
        logger.info("Payment order extra filters already expanded");
        return;
      }
      await pom.extraFiltersButton.click();
      await expect(pom.bankedStatus).toBeVisible();
      logger.info("Successfully clicked the payment order add filters icon");
    });
  }
}

export class PaymentOrderUIFilterBankedStatus extends TestPoint {
  constructor(status: string) {
    super("TP", "Filter payment order banked status", async (page) => {
      if (!status) return;
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.bankedStatus, status);
    });
  }
}

export class PaymentOrderUIFilterFileID extends TestPoint {
  constructor(fileId?: string) {
    super("TP", "Filter payment order file id", async (page) => {
      if (fileId === "") return;
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      const id = fileId && !looksLikeFileName(fileId) ? fileId : await assignedFileId(pom);
      await pom.fileIdInput.fill(id);
    });
  }
}

export class PaymentOrderUIClearQuickFilter extends TestPoint {
  constructor() {
    super("TP", "Clear payment order quick filter", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
    });
  }
}

export class PaymentOrderUIClickSearch extends TestPoint {
  constructor() {
    super("TP", "click payment order advanced search", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
      await expect(pom.quickSearchInput).toHaveValue("");
      await expect(pom.search).toBeEnabled();
      await pom.search.click();
      logger.info("Successfully clicked the payment order advanced search button");
    });
  }
}

export class PaymentOrderUICheckIfTableNotEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if payment order table is not empty", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectTableHasRows(pom.host);
    });
  }
}

export class PaymentOrderUICheckIfTableEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if payment order table is empty", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.expectTableEmpty(pom.host);
    });
  }
}
