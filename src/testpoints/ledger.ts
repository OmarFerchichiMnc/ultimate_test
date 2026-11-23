// TestPoints used by the scenario specs (ledger). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { GlDetailsPage } from "../pages/glDetails.page";
import { ImbalancedItemsPage } from "../pages/imbalancedItems.page";
import { PostToLedgerPage } from "../pages/postToLedger.page";
import {
  assertLastExportHasLines,
  assertText,
  clickNamed,
  confirmAction,
  downloadExport,
} from "../pages/scenarioSupport";
import { TrialBalancePage } from "../pages/trialBalance.page";

export class PostToLedgerGenerate extends TestPoint {
  constructor() {
    super("TP-NEW-117", "Generate the GL export", async (page) => {
      const pom = new PostToLedgerPage(page);
      await clickNamed(pom, /generate/i);
      await expect(pom.page.getByText(/success/i).first()).toBeVisible({ timeout: 120_000 });
    });
  }
}

export class PostToLedgerAssertFile extends TestPoint {
  constructor() {
    super("TP-NEW-118", "Download the GL file and check its structure", async (page) => {
      const pom = new PostToLedgerPage(page);
      const download = pom.page
        .getByRole("link", { name: /download|\.txt|\.csv/i })
        .or(pom.page.locator(".pi-download").locator("xpath=ancestor::button[1]"));
      await downloadExport(pom, download.first());
      await assertLastExportHasLines(pom, 2);
    });
  }
}

export class GlDetailsAssertGroupHeader extends TestPoint {
  constructor(groupHeaderId: string) {
    super("TP-NEW-119", `Assert GL details for group header ${groupHeaderId}`, async (page) => {
      const pom = new GlDetailsPage(page);
      await assertText(pom, groupHeaderId);
      await pom.expectTableHasRows();
    });
  }
}

export class TrialBalanceCalculateClosedPeriod extends TestPoint {
  constructor() {
    super("TP-NEW-120", "Calculate the closed accounting period", async (page) => {
      await confirmAction(new TrialBalancePage(page), /calculate/i);
    });
  }
}

export class TrialBalanceAssertBalances extends TestPoint {
  constructor() {
    super("TP-NEW-121", "Assert trial balance rows", async (page) => {
      const pom = new TrialBalancePage(page);
      await pom.expectTableHasRows();
      const text = (await pom.tableRows().first().innerText()) || "";
      if (!/\d/.test(text)) {
        throw new Error(`Trial balance row has no amount: ${text}`);
      }
    });
  }
}

export class ImbalancedItemsAssertStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-122", `Assert imbalanced status ${status}`, async (page) => {
      await new ImbalancedItemsPage(page).expectTableContains(status);
    });
  }
}
