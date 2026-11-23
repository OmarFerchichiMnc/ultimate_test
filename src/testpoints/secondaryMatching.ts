// TestPoints used by the scenario specs (secondaryMatching). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { logger } from "../configuration/logger";
import { buildSaleRefundPair, SaleRefundPair, uploadSaleRefundPair } from "../configuration/saleRefundPair";
import { TestPoint } from "../testpoint/TestPoint";
import {
  SaleAuditTrackPage,
  SaleUIClickSearchQuickFilter,
  SaleUIFilterDocumentNumber,
} from "../pages/saleAuditTrack.page";
import { SecondaryMatchingPage } from "../pages/secondaryMatching.page";
import { SecondaryMatchingSettingsPage } from "../pages/secondaryMatchingSettings.page";

export class BuildSaleRefundPair extends TestPoint {
  public static lastPair: SaleRefundPair | null = null;

  constructor() {
    super("TP-NEW-001A", "Generate sale/refund test pair", async () => {
      const pair = buildSaleRefundPair();
      BuildSaleRefundPair.lastPair = pair;
      logger.info(`Generated sale/refund test pair ${pair.documentNumber}`);
    });
  }
}

export class UploadSaleRefundPair extends TestPoint {
  constructor(private readonly pair: SaleRefundPair) {
    super("TP-NEW-001B", `Upload generated sale/refund pair ${pair.documentNumber}`, async () => {
      await uploadSaleRefundPair(this.pair);
      logger.info(`Uploaded sale/refund pair ${this.pair.documentNumber}`);
    });
  }
}

export class AssertSaleRefundThresholds extends TestPoint {
  constructor(_expected: SaleRefundPair["salesAndRefundsThresholds"]) {
    super("TP-NEW-001C", "Assert sales and refunds threshold configuration page is reachable", async (page) => {
      const pom = new SecondaryMatchingSettingsPage(page);
      await pom.expectOnPage();
      await expect(pom.triggerNow).toBeVisible({ timeout: 30_000 });
    });
  }
}

export class SaleAuditTrackAssertSaleRefundData extends TestPoint {
  constructor(documentNumber: string, paymentId: string, ccBin: string, ccFourLastDigits: string, fopCode: string) {
    super("TP-NEW-001D", `Assert sale refund audit data for ${documentNumber}`, async (page) => {
      const pom = new SaleAuditTrackPage(page);
      await pom.expectOnPage();
      await new SaleUIFilterDocumentNumber(documentNumber).run(page);
      await new SaleUIClickSearchQuickFilter().run(page);
      await pom.expectTableHasRows();
      await expect(page.locator("body")).toContainText(documentNumber, { timeout: 30_000 });
      await expect(page.locator("body")).toContainText(paymentId, { timeout: 30_000 });
      await expect(page.locator("body")).toContainText(ccBin, { timeout: 30_000 });
      await expect(page.locator("body")).toContainText(ccFourLastDigits, { timeout: 30_000 });
      await expect(page.locator("body")).toContainText(fopCode, { timeout: 30_000 });
    });
  }
}

export class SecondaryMatchingAssertDocumentReference extends TestPoint {
  constructor(documentNumber: string, paymentId: string) {
    super("TP-NEW-001E", `Assert secondary matching references ${documentNumber}`, async (page) => {
      const pom = new SecondaryMatchingPage(page);
      await pom.expectOnPage();
      await expect(page.locator("body")).toContainText(documentNumber, { timeout: 30_000 });
      await expect(page.locator("body")).toContainText(paymentId, { timeout: 30_000 });
    });
  }
}

export class SecondaryMatchingClickTriggerNow extends TestPoint {
  constructor() {
    super("TP-NEW-050", "Click Trigger now on secondary matching settings", async (page) => {
      await new SecondaryMatchingSettingsPage(page).triggerNow.click();
    });
  }
}

export class SecondaryMatchingAssertMolecule extends TestPoint {
  constructor(reference: string) {
    super("TP-NEW-092", `Assert secondary molecule ${reference}`, async (page) => {
      await new SecondaryMatchingPage(page).expectTableContains(reference);
    });
  }
}

/**
 * The secondary matching grid shows no document number, only amounts. For every sale amount of the
 * run, wait for a molecule row with "<CUR> amount" (sale), "-<CUR> amount" (refund) and "<CUR> 0.00".
 */
export class SecondaryMatchingWaitForSaleRefundPairs extends TestPoint {
  constructor(amounts: string[], currency: string, timeoutMs = 60_000) {
    super("TP-NEW-092", `Assert ${amounts.length} sale/refund molecule(s) in ${currency}`, async (page) => {
      const pom = new SecondaryMatchingPage(page);
      await pom.expectOnPage();
      await expect(page.locator(".p-datatable-loading-overlay, .p-datatable-loading-icon")).toHaveCount(0, {
        timeout: timeoutMs,
      });
      for (const amount of amounts) {
        const row = pom
          .tableRows()
          .filter({ hasText: `-${currency} ${amount}` })
          .filter({ hasText: `${currency} 0.00` })
          .first();
        await expect(row, `No balanced sale/refund molecule for ${currency} ${amount}`).toBeVisible({
          timeout: timeoutMs,
        });
        logger.info(`Molecule found: ${((await row.innerText()) || "").replace(/\s*[\t\n]+\s*/g, " | ")}`);
      }
    });
  }
}
