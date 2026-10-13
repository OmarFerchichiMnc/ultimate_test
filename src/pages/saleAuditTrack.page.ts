import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { assignedFileId, looksLikeFileName } from "./scenarioSupport";

export class SaleAuditTrackPage extends BasePage {
  static readonly path = "/audit-track/sale";
  static testPoints(): TestPoint[] {
    return [
      new OpenSaleAuditTrackPage(),
      new InspectSaleAuditTrackSearch(),
      new InspectSaleAuditTrackDateRange(),
      new InspectSaleAuditTrackSelectAChannelType(),
      new InspectSaleAuditTrackExtraFiltersButton(),
      new InspectSaleAuditTrackSalesTab(),
      new InspectSaleAuditTrackRefundedSalesTab(),
      new InspectSaleAuditTrackDeletedSalesTab(),
      new InspectSaleAuditTrackDeletedSales(),
      new InspectSaleAuditTrackRefundedSales(),
    ];
  }

  readonly search: Locator;
  readonly dateRange: Locator;
  readonly selectAChannelType: Locator;
  readonly extraFiltersButton: Locator;
  readonly salesTab: Locator;
  readonly refundedSalesTab: Locator;
  readonly deletedSalesTab: Locator;
  readonly deletedSales: Locator;
  readonly refundedSales: Locator;
  readonly quickFilter: Locator;
  readonly saleIdRadio: Locator;
  readonly documentNumberRadio: Locator;
  readonly pnrRadio: Locator;
  readonly paymentIdRadio: Locator;
  readonly creditCardRadio: Locator;
  readonly approvalCodeRadio: Locator;
  readonly quickSearchInput: Locator;
  readonly quickSearchLast4Input: Locator;
  readonly quickSearchButton: Locator;
  readonly paymentDateInput: Locator;
  readonly countryInput: Locator;
  readonly fileIdInput: Locator;
  readonly fopCode: Locator;
  readonly fopSubCode: Locator;
  readonly settledStatus: Locator;

  constructor(page: Page) {
    super(page, SaleAuditTrackPage.path);
    this.search = this.page
      .locator("p-card")
      .filter({ has: this.page.getByRole("heading", { name: "Advanced Filters" }) })
      .getByRole("button", { name: "Search" });
    this.dateRange = this.findCalendarTrigger();
    this.selectAChannelType = this.findDropdown("Select a channel type");
    this.extraFiltersButton = this.page
      .locator("adad-frontend-sales-audit-track-filters")
      .getByRole("button")
      .filter({ has: this.page.locator(".pi-filter") });
    this.salesTab = this.page.getByRole("button", { name: "Sales", exact: true });
    this.refundedSalesTab = this.page.getByRole("button", { name: "Refunded Sales", exact: true });
    this.deletedSalesTab = this.page.getByRole("button", { name: "Deleted Sales", exact: true });
    this.deletedSales = this.page.getByRole("button", { name: "Deleted Sales" }).last();
    this.refundedSales = this.page.getByRole("button", { name: "Refunded Sales" }).last();
    this.quickFilter = this.page.locator("adad-frontend-quick-search-standalone-filter");
    this.saleIdRadio = this.findRadio("Sale ID", this.quickFilter);
    this.documentNumberRadio = this.findRadio("Document Number", this.quickFilter);
    this.pnrRadio = this.findRadio("PNR/Order Reference", this.quickFilter);
    this.paymentIdRadio = this.findRadio("Payment ID", this.quickFilter);
    this.creditCardRadio = this.findRadio("Credit Card Number", this.quickFilter);
    this.approvalCodeRadio = this.findRadio("Approval Code", this.quickFilter);
    this.quickSearchInput = this.quickFilter.getByRole("textbox").first();
    this.quickSearchLast4Input = this.quickFilter.getByPlaceholder("Enter Credit Card 4 Last Digits");
    this.quickSearchButton = this.quickFilter.getByRole("button", { name: "Search" });
    this.paymentDateInput = this.page.getByPlaceholder("Select payment date range");
    this.countryInput = this.page.getByPlaceholder("Country", { exact: true });
    this.fileIdInput = this.page.getByPlaceholder("File ID", { exact: true });
    this.fopCode = this.findDropdown("Select FOP Code");
    this.fopSubCode = this.findDropdown("Select Fop sub code");
    this.settledStatus = this.findDropdown("Select Settled Status");
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
    logger.info("Quick filter is empty");
  }
}

export class OpenSaleAuditTrackPage extends TestPoint {
  constructor() {
    super("TP-OPEN-AUDIT_TRACK_SALE", "Open /audit-track/sale", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSaleAuditTrackSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-01",
      "Inspect \"Search\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-AUDIT_TRACK_SALE-01 Search on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleAuditTrackDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-02",
      "Inspect \"pi pi-calendar\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-AUDIT_TRACK_SALE-02 pi pi-calendar on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleAuditTrackSelectAChannelType extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-03",
      "Inspect \"Select a channel type\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.selectAChannelType, "TP-BTN-AUDIT_TRACK_SALE-03 Select a channel type on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleAuditTrackExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-04",
      "Inspect \"pi pi-filter\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-AUDIT_TRACK_SALE-04 pi pi-filter on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleAuditTrackSalesTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-05",
      "Inspect \"Sales\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.salesTab, "TP-BTN-AUDIT_TRACK_SALE-05 Sales on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleAuditTrackRefundedSalesTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-06",
      "Inspect \"Refunded Sales\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.refundedSalesTab, "TP-BTN-AUDIT_TRACK_SALE-06 Refunded Sales on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSaleAuditTrackDeletedSalesTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-07",
      "Inspect (do not click) \"Deleted Sales\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.deletedSalesTab, "TP-BTN-AUDIT_TRACK_SALE-07 Deleted Sales on /audit-track/sale");
        logger.info(`Skipping click for destructive control TP-BTN-AUDIT_TRACK_SALE-07: Deleted Sales`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectSaleAuditTrackDeletedSales extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-08",
      "Inspect (do not click) \"Deleted Sales\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.deletedSales, "TP-BTN-AUDIT_TRACK_SALE-08 Deleted Sales on /audit-track/sale");
        logger.info(`Skipping click for destructive control TP-BTN-AUDIT_TRACK_SALE-08: Deleted Sales`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class InspectSaleAuditTrackRefundedSales extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SALE-09",
      "Inspect \"Refunded Sales\" on /audit-track/sale",
      async (page) => {
        const pom = new SaleAuditTrackPage(page);
        await pom.expectVisible(pom.refundedSales, "TP-BTN-AUDIT_TRACK_SALE-09 Refunded Sales on /audit-track/sale");
      },
      "*****",
      "ready",
    );
  }
}

export class SaleUIFilterSelectSaleIDToFilter extends TestPoint {
  constructor() {
    super("TP", "click Sale Id icon", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.saleIdRadio.click();
      logger.info("Sale Id icon check clicked");
    });
  }
}

export class SaleUIFilterSaleID extends TestPoint {
  constructor(saleId: string) {
    super("TP", `Filter sale id ${saleId}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterSelectSaleIDToFilter().run(page);
      await pom.quickSearchInput.fill(String(saleId));
      logger.info(`Sale ID '${saleId}' entered successfully`);
    });
  }
}

export class SaleUIFilterSelectDocumentNumberToFilter extends TestPoint {
  constructor() {
    super("TP", "click document number icon", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.documentNumberRadio.click();
    });
  }
}

export class SaleUIFilterDocumentNumber extends TestPoint {
  constructor(documentNumber: string) {
    super("TP", `filter document number ${documentNumber}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterSelectDocumentNumberToFilter().run(page);
      await pom.quickSearchInput.fill(documentNumber);
    });
  }
}

export class SaleUIFilterSelectPNROrderReferenceToFilter extends TestPoint {
  constructor() {
    super("TP", "click PNR/Order Reference icon", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.pnrRadio.click();
    });
  }
}

export class SaleUIFilterPNROrderReference extends TestPoint {
  constructor(pnr: string) {
    super("TP", `Filter PNR ${pnr}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterSelectPNROrderReferenceToFilter().run(page);
      await pom.quickSearchInput.fill(pnr);
    });
  }
}

export class SaleUIFilterSelectPaymentIDToFilter extends TestPoint {
  constructor() {
    super("TP", "click Payment ID icon", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.paymentIdRadio.click();
    });
  }
}

export class SaleUIFilterPaymentID extends TestPoint {
  constructor(paymentId: string) {
    super("TP", `Filter payment id ${paymentId}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterSelectPaymentIDToFilter().run(page);
      await pom.quickSearchInput.fill(paymentId);
    });
  }
}

export class SaleUIFilterSelectCreditCardNumberToFilter extends TestPoint {
  constructor() {
    super("TP", "click credit card icon", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.creditCardRadio.click();
    });
  }
}

export class SaleUIFilterCreditCardBIN extends TestPoint {
  constructor(bin: string) {
    super("TP", `Filter credit card BIN ${bin}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterSelectCreditCardNumberToFilter().run(page);
      await pom.quickSearchInput.fill(bin);
    });
  }
}

export class SaleUIFilterCreditCard4LastDegits extends TestPoint {
  constructor(last4: string) {
    super("TP", `Filter credit card last 4 ${last4}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.quickSearchLast4Input.fill(last4);
    });
  }
}

export class SaleUIFilterSelectApprovalCodeToFilter extends TestPoint {
  constructor() {
    super("TP", "click approval code icon", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.approvalCodeRadio.click();
    });
  }
}

export class SaleUIFilterApprovalCode extends TestPoint {
  constructor(approvalCode: string) {
    super("TP", `Filter Approval Code ${approvalCode}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterSelectApprovalCodeToFilter().run(page);
      await pom.quickSearchInput.fill(approvalCode);
    });
  }
}

export class SaleUIClickSearchQuickFilter extends TestPoint {
  constructor() {
    super("TP", "click quick search", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await expect(pom.quickSearchButton).toBeEnabled();
      await pom.quickSearchButton.click();
    });
  }
}

export class SaleUIFilterPaymentDateRange extends TestPoint {
  constructor(date: string) {
    super("TP", "Filter payment date range in sales within sale page", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.fillDateRange(pom.paymentDateInput, date);
    });
  }
}

export class SaleUIFilterChannelType extends TestPoint {
  constructor(channelType: string) {
    super("TP", "Filter Channel Type in sales within sale page", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
    });
  }
}

export class SaleUIFilterCountry extends TestPoint {
  constructor(country: string) {
    super("TP", "filter Country", async (page) => {
      if (!country) return;
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.countryInput.fill(country);
    });
  }
}

export class SaleUIFilterFileID extends TestPoint {
  constructor(fileId?: string) {
    super("TP", "filter File ID", async (page) => {
      if (fileId === "") return;
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      const id = fileId && !looksLikeFileName(fileId) ? fileId : await assignedFileId(pom);
      await pom.fileIdInput.fill(id);
    });
  }
}

export class SaleUIAddFilters extends TestPoint {
  constructor() {
    super("TP", "Click add filter", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      if (await pom.fopCode.isVisible().catch(() => false)) {
        logger.info("Extra filters already expanded");
        return;
      }
      await pom.extraFiltersButton.click();
      await expect(pom.fopCode).toBeVisible();
      logger.info("Successfully clicked the add filters icon");
    });
  }
}

export class SaleUIFilterFOPCode extends TestPoint {
  constructor(fopCode: string) {
    super("TP", "Filter fop code in sales within sale page", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.fopCode, fopCode);
    });
  }
}

export class SaleUIFilterFOPSubCode extends TestPoint {
  constructor(fopSubCode: string) {
    super("TP", "Filter fop sub code in sales within sale page", async (page) => {
      if (!fopSubCode) {
        logger.info("No FOP sub code existing");
        return;
      }
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.fopSubCode, fopSubCode);
    });
  }
}

export class SaleUIFilterSettledStatus extends TestPoint {
  constructor(status: string) {
    super("TP", "Filter settled status in sales within sale page", async (page) => {
      if (!status) {
        logger.info("No status");
        return;
      }
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.settledStatus, status);
    });
  }
}

export class SaleUIClearQuickFilter extends TestPoint {
  constructor() {
    super("TP", "Clear quick filter", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
    });
  }
}

export class SaleUIClickSearch extends TestPoint {
  constructor() {
    super("TP", "click advanced search button", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
      await expect(pom.quickSearchInput).toHaveValue("");
      await expect(pom.search).toBeEnabled();
      await pom.search.click();
      logger.info("Successfully clicked the advanced search button");
    });
  }
}

export class SaleUICheckIfSaleTableNotEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if sale table is not empty", async (page) => {
      await new SaleAuditTrackPage(page).expectTableHasRows();
    });
  }
}

export class SaleUICheckIfSaleTableEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if sale table is empty", async (page) => {
      await new SaleAuditTrackPage(page).expectTableEmpty();
    });
  }
}
