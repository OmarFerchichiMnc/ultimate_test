// TestPoints used by the scenario specs (helpers). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect, Page } from "@playwright/test";
import { logger } from "../configuration/logger";
import { BasePage } from "../pages/BasePage";

export async function selectTwoPanes(pom: BasePage): Promise<void> {
  const tables = pom.page.locator("p-table");
  const count = await tables.count();
  if (count >= 2) {
    await tables.nth(0).locator(".p-checkbox, [role=checkbox]").first().click();
    await tables.nth(1).locator(".p-checkbox, [role=checkbox]").first().click();
    return;
  }
  const boxes = pom.page.locator(".p-checkbox, [role=checkbox]");
  await boxes.nth(0).click();
  await boxes.nth(1).click();
}

export async function setRulePriority(page: Page, ruleName: string, priority: string): Promise<void> {
  const row = page.getByRole("row").filter({ hasText: ruleName }).first();
  await expect(row, `Rule row '${ruleName}'`).toBeVisible();
  const edit = row
    .getByRole("button")
    .filter({ has: page.locator(".pi-pencil") })
    .first();
  await edit.click();
  const priorityInput = page
    .getByLabel(/priority/i)
    .or(page.getByPlaceholder(/priority/i))
    .first();
  await expect(priorityInput).toBeVisible();
  await priorityInput.fill(priority);
  await page.getByRole("button", { name: /save/i }).first().click();
  logger.info(`Set ${ruleName} priority to ${priority}`);
}
