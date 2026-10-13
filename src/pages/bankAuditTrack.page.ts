import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { assignedFileId, looksLikeFileName } from "./scenarioSupport";

export class BankAuditTrackPage extends BasePage {
  static readonly path = "/audit-track/bank";
  static testPoints(): TestPoint[] {
    return [
      new OpenBankAuditTrackPage(),
      new InspectBankAuditTrackSearch(),
      new InspectBankAuditTrackDateRange(),
      new InspectBankAuditTrackSelectCustomerAcquirer(),
      new InspectBankAuditTrackExtraFiltersButton(),
    ];
  }

  readonly host: Locator;
  readonly search: Locator;
  readonly dateRange: Locator;
  readonly extraFiltersButton: Locator;
  readonly quickFilter: Locator;
  readonly quickSearchInput: Locator;
  readonly quickSearchButton: Locator;
  readonly paymentDateInput: Locator;
  readonly selectCustomerAcquirer: Locator;
  readonly bankDepositReference: Locator;
  readonly bankAccountNumber: Locator;
  readonly fileIdInput: Locator;
  readonly bankedStatus: Locator;

  constructor(page: Page) {
    super(page, BankAuditTrackPage.path);
    this.host = this.page.locator("adad-frontend-bank-deposits-audit-track");
    this.search = this.host
      .locator("p-card")
      .filter({ has: this.page.getByRole("heading", { name: "Advanced Filters" }) })
      .getByRole("button", { name: "Search" });
    this.dateRange = this.host.locator("button.p-datepicker-trigger");
    this.extraFiltersButton = this.host.getByRole("button").filter({ has: this.page.locator(".pi-filter") });
    this.quickFilter = this.host.locator("adad-frontend-quick-search-standalone-filter");
    this.quickSearchInput = this.quickFilter.getByRole("textbox", { name: /enter bank deposit id/i });
    this.quickSearchButton = this.quickFilter.getByRole("button", { name: "Search" });
    this.paymentDateInput = this.host.getByPlaceholder("Select bank deposit date range");
    this.selectCustomerAcquirer = this.host
      .locator("p-dropdown, p-multiselect")
      .filter({ has: this.page.getByPlaceholder("Select Customer/Acquirer", { exact: true }) });
    this.bankDepositReference = this.host.getByPlaceholder("Bank Deposit Reference", { exact: true });
    this.bankAccountNumber = this.host.getByPlaceholder("Bank Account Number", { exact: true });
    this.fileIdInput = this.host.getByPlaceholder("File ID", { exact: true });
    this.bankedStatus = this.host
      .locator("p-dropdown, p-multiselect")
      .filter({ has: this.page.getByPlaceholder("Select Banked Status", { exact: true }) });
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
    logger.info("Bank deposit quick filter is empty");
  }
}

export class OpenBankAuditTrackPage extends TestPoint {
  constructor() {
    super("TP-OPEN-AUDIT_TRACK_BANK", "Open /audit-track/bank", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectBankAuditTrackSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_BANK-01",
      "Inspect \"Search\" on /audit-track/bank",
      async (page) => {
        const pom = new BankAuditTrackPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-AUDIT_TRACK_BANK-01 Search on /audit-track/bank");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectBankAuditTrackDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_BANK-02",
      "Inspect \"pi pi-calendar\" on /audit-track/bank",
      async (page) => {
        const pom = new BankAuditTrackPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-AUDIT_TRACK_BANK-02 pi pi-calendar on /audit-track/bank");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectBankAuditTrackSelectCustomerAcquirer extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_BANK-03",
      "Inspect \"Select Customer/Acquirer\" on /audit-track/bank",
      async (page) => {
        const pom = new BankAuditTrackPage(page);
        await pom.expectVisible(pom.selectCustomerAcquirer, "TP-BTN-AUDIT_TRACK_BANK-03 Select Customer/Acquirer on /audit-track/bank");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectBankAuditTrackExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-AUDIT_TRACK_BANK-04",
      "Inspect \"pi pi-filter\" on /audit-track/bank",
      async (page) => {
        const pom = new BankAuditTrackPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-AUDIT_TRACK_BANK-04 pi pi-filter on /audit-track/bank");
      },
      "*****",
      "ready",
    );
  }
}

export class BankUIFilterBankDepositID extends TestPoint {
  constructor(id: string) {
    super("TP", `Filter bank deposit id ${id}`, async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.quickSearchInput.fill(String(id));
    });
  }
}

export class BankUIClickSearchQuickFilter extends TestPoint {
  constructor() {
    super("TP", "click bank deposit quick search", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await expect(pom.quickSearchButton).toBeEnabled();
      await pom.quickSearchButton.click();
    });
  }
}

export class BankUIFilterBankDepositDateRange extends TestPoint {
  constructor(date: string) {
    super("TP", "Filter bank deposit date range", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.fillDateRange(pom.paymentDateInput, date);
    });
  }
}

export class BankUIFilterCustomerAcquirer extends TestPoint {
  constructor(acquirer: string) {
    super("TP", "Filter bank deposit customer acquirer", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.selectCustomerAcquirer, acquirer);
    });
  }
}

export class BankUIFilterBankDepositReference extends TestPoint {
  constructor(reference: string) {
    super("TP", "Filter bank deposit reference", async (page) => {
      if (!reference) return;
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.bankDepositReference.fill(reference);
    });
  }
}

export class BankUIFilterBankAccountNumber extends TestPoint {
  constructor(account: string) {
    super("TP", "Filter bank account number", async (page) => {
      if (!account) return;
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.bankAccountNumber.fill(account);
    });
  }
}

export class BankUIAddFilters extends TestPoint {
  constructor() {
    super("TP", "Click bank deposit add filter", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      if (await pom.bankedStatus.isVisible().catch(() => false)) {
        logger.info("Bank deposit extra filters already expanded");
        return;
      }
      await pom.extraFiltersButton.click();
      await expect(pom.bankedStatus).toBeVisible();
      logger.info("Successfully clicked the bank deposit add filters icon");
    });
  }
}

export class BankUIFilterBankedStatus extends TestPoint {
  constructor(status: string) {
    super("TP", "Filter bank deposit banked status", async (page) => {
      if (!status) return;
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.selectDropdownOption(pom.bankedStatus, status);
    });
  }
}

export class BankUIFilterFileID extends TestPoint {
  constructor(fileId?: string) {
    super("TP", "Filter bank deposit file id", async (page) => {
      if (fileId === "") return;
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      const id = fileId && !looksLikeFileName(fileId) ? fileId : await assignedFileId(pom);
      await pom.fileIdInput.fill(id);
    });
  }
}

export class BankUIClearQuickFilter extends TestPoint {
  constructor() {
    super("TP", "Clear bank deposit quick filter", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
    });
  }
}

export class BankUIClickSearch extends TestPoint {
  constructor() {
    super("TP", "click bank deposit advanced search", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectOnPage();
      await pom.clearQuickFilter();
      await expect(pom.quickSearchInput).toHaveValue("");
      await expect(pom.search).toBeEnabled();
      await pom.search.click();
      logger.info("Successfully clicked the bank deposit advanced search button");
    });
  }
}

export class BankUICheckIfTableNotEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if bank deposit table is not empty", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectTableHasRows(pom.host);
    });
  }
}

export class BankUICheckIfTableEmpty extends TestPoint {
  constructor() {
    super("TP", "Check if bank deposit table is empty", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await pom.expectTableEmpty(pom.host);
    });
  }
}
