// TestPoints used by the scenario specs (settings). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { GeneralSettingsPage } from "../pages/generalSettings.page";
import { PendingItemsPage } from "../pages/pendingItems.page";
import { PointOfSalesPage } from "../pages/pointOfSales.page";
import { confirmAction } from "../pages/scenarioSupport";
import { TransactionSettingsPage } from "../pages/transactionSettings.page";

export class TransactionSettingsSetExpirationThreshold extends TestPoint {
  constructor(datasource: string, threshold: string) {
    super("TP-NEW-033", `Set expiration threshold ${threshold} for ${datasource}`, async (page) => {
      const pom = new TransactionSettingsPage(page);
      await pom.selectDropdownOption(pom.acquirer, datasource);
      const input = pom.page.getByLabel(/expir/i).or(pom.page.getByPlaceholder(/expir/i)).first();
      await expect(input).toBeVisible();
      await input.fill(threshold);
      await pom.page.getByRole("button", { name: /save/i }).first().click();
    });
  }
}

export class PointOfSalesCreateOffice extends TestPoint {
  constructor(officeId: string) {
    super("TP-NEW-034", `Create point of sale ${officeId}`, async (page) => {
      const pom = new PointOfSalesPage(page);
      await pom.create.click();
      const dialog = pom.page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await dialog.getByRole("textbox").first().fill(officeId);
      await dialog
        .getByRole("button", { name: /save|create/i })
        .first()
        .click();
    });
  }
}

export class GeneralSettingsReplayFailedTransactions extends TestPoint {
  constructor() {
    super("TP-NEW-035", "Replay failed transactions from General Settings", async (page) => {
      await confirmAction(new GeneralSettingsPage(page), /replay/i);
    });
  }
}

export class AssertTransactionAccepted extends TestPoint {
  constructor(itemText = "Accepted") {
    super("TP-NEW-036", `Assert transaction is now accepted (${itemText})`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.expectOnPage();
      await pom.expectTableContains(itemText);
    });
  }
}
