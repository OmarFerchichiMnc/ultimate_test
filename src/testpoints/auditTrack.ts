// TestPoints used by the scenario specs (auditTrack). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { BankAuditTrackPage } from "../pages/bankAuditTrack.page";
import { PaymentOrderAuditTrackPage } from "../pages/paymentOrderAuditTrack.page";
import { SaleAuditTrackPage } from "../pages/saleAuditTrack.page";
import {
  assertDetailsContain,
  assertLastExportMatchesGrid,
  assertText,
  clickNamed,
  downloadExport,
  exportButton,
} from "../pages/scenarioSupport";
import { SettlementAuditTrackPage } from "../pages/settlementAuditTrack.page";

export class SaleAuditTrackOpenTab extends TestPoint {
  constructor(tab: "Sales" | "Refunded Sales" | "Deleted Sales" | "Expired") {
    super("TP-NEW-075", `Open sale audit tab ${tab}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      const target =
        tab === "Sales"
          ? pom.salesTab
          : tab === "Refunded Sales"
            ? pom.refundedSalesTab
            : tab === "Deleted Sales"
              ? pom.deletedSalesTab
              : pom.page.getByRole("button", { name: /expired/i }).first();
      await target.click();
    });
  }
}

export class SaleAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-076", "Assert sale audit events", async (page) => {
      await assertDetailsContain(new SaleAuditTrackPage(page), fragments);
    });
  }
}

export class SaleAuditTrackClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-077", "Export the sale audit grid", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class SaleAuditTrackAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-078", "Assert the sale export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new SaleAuditTrackPage(page));
    });
  }
}

export class SaleAuditTrackOpenAccountingDetails extends TestPoint {
  constructor() {
    super("TP-NEW-079", "Open sale accounting details", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await clickNamed(pom, /accounting/i);
    });
  }
}

export class SaleAuditTrackOpenGroupHeader extends TestPoint {
  constructor() {
    super("TP-NEW-080", "Open the group header from accounting details", async (page) => {
      const pom = new SaleAuditTrackPage(page);
      const link = pom.page.getByRole("link").or(pom.page.getByRole("button", { name: /group header/i }));
      await link.first().click();
      await expect(pom.page).toHaveURL(/gl-details/);
    });
  }
}

export class SaleAuditTrackAssertAppliedRule extends TestPoint {
  constructor(ruleName: string) {
    super("TP-NEW-081", `Assert applied rule ${ruleName}`, async (page) => {
      await assertText(new SaleAuditTrackPage(page), ruleName);
    });
  }
}

export class SaleAuditTrackAssertAccountingDate extends TestPoint {
  constructor(eventText: string) {
    super("TP-NEW-082", `Assert accounting date event ${eventText}`, async (page) => {
      await assertText(new SaleAuditTrackPage(page), eventText);
    });
  }
}

export class SettlementAuditTrackOpenTab extends TestPoint {
  constructor(tab: "Settlements" | "Refunded Settlements" | "Deleted Settlements" | "Expired") {
    super("TP-NEW-083", `Open settlement audit tab ${tab}`, async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      const target =
        tab === "Settlements"
          ? pom.settlementsTab
          : tab === "Refunded Settlements"
            ? pom.refundedSettlementsTab
            : tab === "Deleted Settlements"
              ? pom.deletedSettlementsTab
              : pom.page.getByRole("button", { name: /expired/i }).first();
      await target.click();
    });
  }
}

export class SettlementAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-084", "Assert settlement audit events", async (page) => {
      await assertDetailsContain(new SettlementAuditTrackPage(page), fragments);
    });
  }
}

export class SettlementAuditTrackClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-085", "Export the settlement audit grid", async (page) => {
      const pom = new SettlementAuditTrackPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class SettlementAuditTrackAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-086", "Assert the settlement export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new SettlementAuditTrackPage(page));
    });
  }
}

export class PaymentOrderAuditTrackOpenDeleted extends TestPoint {
  constructor() {
    super("TP-NEW-087", "Open deleted payment orders", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await pom.host
        .getByRole("button", { name: /deleted/i })
        .first()
        .click();
    });
  }
}

export class PaymentOrderAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-088", "Assert payment order audit events", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await assertDetailsContain(pom, fragments, pom.host);
    });
  }
}

export class PaymentOrderAuditTrackClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-089", "Export payment orders", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class PaymentOrderAuditTrackAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-090", "Assert the payment order export matches the grid", async (page) => {
      const pom = new PaymentOrderAuditTrackPage(page);
      await assertLastExportMatchesGrid(pom, pom.host);
    });
  }
}

export class BankAuditTrackAssertLifecycleEvents extends TestPoint {
  constructor(fragments: string[] = []) {
    super("TP-NEW-091", "Assert bank deposit audit events", async (page) => {
      const pom = new BankAuditTrackPage(page);
      await assertDetailsContain(pom, fragments, pom.host);
    });
  }
}
