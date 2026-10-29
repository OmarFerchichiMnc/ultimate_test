import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { assignedFileId, looksLikeFileName } from "./scenarioSupport";

export class SettlementAuditTrackPage extends BasePage {
  static readonly path = "/audit-track/settlement";
  static testPoints(): TestPoint[] {
    return [
      new OpenSettlementAuditTrackPage(),
      new InspectSettlementAuditTrackSettlementTab(),
      new InspectSettlementAuditTrackPaymentOrderTab(),
      new InspectSettlementAuditTrackSearch(),
      new InspectSettlementAuditTrackDateRange(),
      new InspectSettlementAuditTrackSelectCustomerAcquirer(),
      new InspectSettlementAuditTrackExtraFiltersButton(),
      new InspectSettlementAuditTrackSettlementsTab(),
      new InspectSettlementAuditTrackRefundedSettlementsTab(),
      new InspectSettlementAuditTrackDeletedSettlementsTab(),
    ];
  }

  readonly settlementTab: Locator;
  readonly paymentOrderTab: Locator;
  readonly search: Locator;
  readonly dateRange: Locator;
  readonly selectCustomerAcquirer: Locator;
  readonly extraFiltersButton: Locator;
  readonly settlementsTab: Locator;
  readonly refundedSettlementsTab: Locator;
  readonly deletedSettlementsTab: Locator;
  readonly quickFilter: Locator;
  readonly settlementIdRadio: Locator;
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
  readonly paymentOrderReference: Locator;
  readonly settledStatus: Locator;
  readonly settlementRows: Locator;

  constructor(page: Page) {
    super(page, SettlementAuditTrackPage.path);
    this.settlementTab = this.page.getByRole("button", { name: "Settlement", exact: true });
    this.paymentOrderTab = this.page.getByRole("button", { name: "Payment Order", exact: true });
    this.search = this.page
      .locator("p-card")
      .filter({ has: this.page.getByRole("heading", { name: "Advanced Filters" }) })
      .getByRole("button", { name: "Search" });
    this.dateRange = this.findCalendarTrigger();
    this.selectCustomerAcquirer = this.findDropdown("Select Customer/Acquirer");
    this.extraFiltersButton = this.page
      .locator("adad-frontend-settlements-audit-track-filters")
      .getByRole("button")
      .filter({ has: this.page.locator(".pi-filter") });
    this.settlementsTab = this.page.getByRole("button", { name: "Settlements", exact: true });
    this.refundedSettlementsTab = this.page.getByRole("button", { name: "Refunded Settlements", exact: true });
    this.deletedSettlementsTab = this.page.getByRole("button", { name: "Deleted Settlements", exact: true });
    this.quickFilter = this.page.locator("adad-frontend-quick-search-standalone-filter");
    this.settlementIdRadio = this.findRadio("Settlement ID", this.quickFilter);
    this.documentNumberRadio = this.findRadio("Document Number", this.quickFilter);
    this.pnrRadio = this.findRadio("PNR/Order Reference", this.quickFilter);
    this.paymentIdRadio = this.findRadio("Payment ID", this.quickFilter);
    this.creditCardRadio = this.findRadio("Credit Card Number", this.quickFilter);
    this.approvalCodeRadio = this.findRadio("Approval Code", this.quickFilter);
    this.quickSearchInput = this.quickFilter.getByRole("textbox").first();
    this.quickSearchLast4Input = this.quickFilter.getByPlaceholder("Enter Credit Card 4 Last Digits");
    this.quickSearchButton = this.quickFilter.getByRole("button", { name: "Search" });
    this.paymentDateInput = this.page.getByPlaceholder("Select settlement date range");
    this.countryInput = this.page.getByPlaceholder("Country", { exact: true });
    this.fileIdInput = this.page.getByPlaceholder("File ID", { exact: true });
    this.fopCode = this.findDropdown("Select FOP Code");
    this.fopSubCode = this.findDropdown("Select Fop sub code");
    this.paymentOrderReference = this.page.getByPlaceholder("Payment Order Reference", { exact: true });
    this.settledStatus = this.findDropdown("Select Settled Status");
    this.settlementRows = this.tableRows();
  }

  async rowTexts(): Promise<string[]> {
    await this.expectTableHasRows();
    return (await this.settlementRows.allInnerTexts()).map((text) => text.replace(/\s+/g, " ").trim());
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

export class OpenSettlementAuditTrackPage extends TestPoint {
  constructor() {
    super("TP-OPEN-AUDIT_TRACK_SETTLEMENT", "Open /audit-track/settlement", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectSettlementAuditTrackSettlementTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-01",
      "Inspect \"Settlement\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.settlementTab, "TP-BTN-AUDIT_TRACK_SETTLEMENT-01 Settlement on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackPaymentOrderTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-02",
      "Inspect \"Payment Order\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.paymentOrderTab, "TP-BTN-AUDIT_TRACK_SETTLEMENT-02 Payment Order on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-03",
      "Inspect \"Search\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-AUDIT_TRACK_SETTLEMENT-03 Search on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-04",
      "Inspect \"pi pi-calendar\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-AUDIT_TRACK_SETTLEMENT-04 pi pi-calendar on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackSelectCustomerAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-05",
      "Inspect \"Select Customer/Acquirer\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.selectCustomerAcquirer, "TP-BTN-AUDIT_TRACK_SETTLEMENT-05 Select Customer/Acquirer on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-06",
      "Inspect \"pi pi-filter\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-AUDIT_TRACK_SETTLEMENT-06 pi pi-filter on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackSettlementsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-07",
      "Inspect \"Settlements\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.settlementsTab, "TP-BTN-AUDIT_TRACK_SETTLEMENT-07 Settlements on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackRefundedSettlementsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-08",
      "Inspect \"Refunded Settlements\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.refundedSettlementsTab, "TP-BTN-AUDIT_TRACK_SETTLEMENT-08 Refunded Settlements on /audit-track/settlement");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectSettlementAuditTrackDeletedSettlementsTab extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_SETTLEMENT-09",
      "Inspect (do not click) \"Deleted Settlements\" on /audit-track/settlement",
      async (page) => {
        const pom = new SettlementAuditTrackPage(page);
        await pom.expectVisible(pom.deletedSettlementsTab, "TP-BTN-AUDIT_TRACK_SETTLEMENT-09 Deleted Settlements on /audit-track/settlement");
        logger.info(`Skipping click for destructive control TP-BTN-AUDIT_TRACK_SETTLEMENT-09: Deleted Settlements`);
      },
      "*****",
      "inspect-only",
    );
  }
}

export class SettlementUIFilterSettlementID extends TestPoint {
  constructor(settlementId: string) {
    super("TP", `Filter settlement id ${settlementId}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.settlementIdRadio.click();
      await pom.quickSearchInput.fill(String(settlementId));
    });
  }
}

export class SettlementUIFilterDocumentNumber extends TestPoint {
  constructor(documentNumber: string) {
    super("TP", `filter document number ${documentNumber}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.documentNumberRadio.click();
      await pom.quickSearchInput.fill(documentNumber);
    });
  }
}

export class SettlementUIFilterPNROrderReference extends TestPoint {
  constructor(pnr: string) {
    super("TP", `Filter PNR ${pnr}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.pnrRadio.click();
      await pom.quickSearchInput.fill(pnr);
    });
  }
}

export class SettlementUIFilterPaymentID extends TestPoint {
  constructor(paymentId: string) {
    super("TP", `Filter payment id ${paymentId}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.paymentIdRadio.click();
      await pom.quickSearchInput.fill(paymentId);
    });
  }
}

export class SettlementUIFilterCreditCardBIN extends TestPoint {
  constructor(bin: string) {
    super("TP", `Filter credit card BIN ${bin}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.creditCardRadio.click();
      await pom.quickSearchInput.fill(bin);
    });
  }
}

export class SettlementUIFilterCreditCard4LastDegits extends TestPoint {
  constructor(last4: string) {
    super("TP", `Filter credit card last 4 ${last4}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.quickSearchLast4Input.fill(last4);
    });
  }
}

export class SettlementUIFilterApprovalCode extends TestPoint {
  constructor(approvalCode: string) {
    super("TP", `Filter Approval Code ${approvalCode}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.approvalCodeRadio.click();
      await pom.quickSearchInput.fill(approvalCode);
    });
  }
}

export class SettlementUIClickSearchQuickFilter extends TestPoint {
  constructor() {
    super("TP", "click quick search", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await expect(pom.quickSearchButton).toBeEnabled();
      await pom.quickSearchButton.click();
    });
  }
}

export class SettlementUICheckIfSearchQuickFilterIsClickable extends TestPoint {
  constructor() {
    super("TP", "Check if quick filters search button", async (page) => {
      await new SettlementAuditTrackPage(page).quickSearchButton.waitFor();
    });
  }
}

export class SettlementUIFilterPaymentDateRange extends TestPoint {
  constructor(date: string) {
    super("TP", "Filter payment date range", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.fillDateRange(pom.paymentDateInput, date);
    });
  }
}

export class SettlementUIFilterCustomerAcquirer extends TestPoint {
  constructor(acquirer: string) {
    super("TP", "Filter customer acquirer", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.selectCustomerAcquirer, acquirer);
    });
  }
}

export class SettlementUIFilterCountry extends TestPoint {
  constructor(country: string) {
    super("TP", "filter Country", async (page) => {
      if (!country) return;
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.countryInput.fill(country);
    });
  }
}

export class SettlementUIFilterFileID extends TestPoint {
  constructor(fileId?: string) {
    super("TP", "filter File ID", async (page) => {
      if (fileId === "") return;
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      const id = fileId && !looksLikeFileName(fileId) ? fileId : await assignedFileId(pom);
      await pom.fileIdInput.fill(id);
    });
  }
}

export class SettlementUIAddFilters extends TestPoint {
  constructor() {
    super("TP", "Click add filter", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
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

export class SettlementUIFilterFOPCode extends TestPoint {
  constructor(fopCode: string) {
    super("TP", "Filter fop code", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.fopCode, fopCode);
    });
  }
}

export class SettlementUIFilterFOPSubCode extends TestPoint {
  constructor(fopSubCode: string) {
    super("TP", "Filter fop sub code", async (page) => {
      if (!fopSubCode) return;
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.fopSubCode, fopSubCode);
    });
  }
}

export class SettlementUIFilterPaymentOrderReference extends TestPoint {
  constructor(reference: string) {
    super("TP", "Filter payment order reference", async (page) => {
      if (!reference) return;
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      if (!(await pom.paymentOrderReference.isVisible().catch(() => false))) {
        logger.info("Payment order reference field is not visible");
        return;
      }
      await pom.paymentOrderReference.fill(reference);
    });
  }
}

export class SettlementUIFilterSettledStatus extends TestPoint {
  constructor(status: string) {
    super("TP", "Filter settled status", async (page) => {
      if (!status) return;
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.settledStatus, status);
    });
  }
}

export class SettlementUIClearQuickFilter extends TestPoint {
  constructor() {
    super("TP", "Clear quick filter", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
    });
  }
}

export class SettlementUIClickSearch extends TestPoint {
  constructor() {
    super("TP", "click advanced search button", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
      await expect(pom.quickSearchInput).toHaveValue("");
      await expect(pom.search).toBeEnabled();
      await pom.search.click();
      logger.info("Successfully clicked the advanced search button");
    });
  }
}

export class SettlementUICheckIfSettlementTableNotEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if settlement table is not empty", async (page) => {
      await new SettlementAuditTrackPage(page).expectTableHasRows();
    });
  }
}

export class SettlementUICheckRowCountMatchesDatabase extends TestPoint {
  constructor(dbRows: Record<string, unknown>[]) {
    super("TP", `Check settlement table has ${dbRows.length} row(s) like the database`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      const texts = await pom.rowTexts();
      texts.forEach((text, index) => logger.info(`UI settlement row ${index + 1}: ${text}`));
      logger.info(`Database settlement ids: ${dbRows.map((row) => String(row.id)).join(", ")}`);
      expect(
        texts.length,
        `UI shows ${texts.length} settlement row(s) but the database has ${dbRows.length} (duplicated settlements)`,
      ).toBe(dbRows.length);
    });
  }
}

export class SettlementUICheckIfSettlementTableEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if settlement table is empty", async (page) => {
      await new SettlementAuditTrackPage(page).expectTableEmpty();
    });
  }
}

/**
 * Quick search reloads the grid asynchronously: wait for the loading spinner to go away,
 * then for a row carrying the searched document number.
 */
export class SettlementUICheckIfSettlementTableHasDocument extends TestPoint {
  constructor(documentNumber: string, timeoutMs = 60_000) {
    super("TP", `Check if settlement table contains document ${documentNumber}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await expect(page.locator(".p-datatable-loading-overlay, .p-datatable-loading-icon")).toHaveCount(0, { timeout: timeoutMs });
      const row = pom.tableRows().filter({ hasText: documentNumber }).first();
      await expect(row, `No settlement row with document number ${documentNumber}`).toBeVisible({ timeout: timeoutMs });
      logger.info(`Settlement row found: ${((await row.innerText()) || "").replace(/\s*[\t\n]+\s*/g, " | ")}`);
    });
  }
}
