import fs from "fs";
import os from "os";
import path from "path";
import { expect, Locator, Page } from "@playwright/test";
import { logger } from "../configuration/logger";
import { BasePage } from "./BasePage";

const lastExport = new WeakMap<Page, string>();

export function exportButton(pom: BasePage): Locator {
  return pom.gridExportButton();
}

export function looksLikeFileName(value: string): boolean {
  return /\.(csv|jsonl|txt|xlsx)$/i.test(value.trim());
}

export async function assignedFileId(pom: BasePage): Promise<string> {
  const id = await pom.firstRowCellByHeader(/^File ID$/i);
  if (!id || looksLikeFileName(id)) {
    throw new Error(`File ID filter needs the assigned file id from the grid, got '${id || ""}'`);
  }
  return id;
}

export async function cellByHeader(pom: BasePage, header: string | RegExp, root?: Locator): Promise<string> {
  return pom.firstRowCellByHeader(header, root);
}

export async function assertColumn(pom: BasePage, header: string | RegExp, expected: string, root?: Locator): Promise<void> {
  const actual = await cellByHeader(pom, header, root);
  const same = actual.toLowerCase() === expected.toLowerCase() || actual.toLowerCase().includes(expected.toLowerCase());
  if (!same) {
    throw new Error(`Expected '${String(header)}' to contain '${expected}', got '${actual}'`);
  }
  logger.info(`Column ${String(header)} is '${actual}'`);
}

export async function assertAnyStatus(pom: BasePage, expected: string, root?: Locator): Promise<void> {
  const options = expected.split(/\s+or\s+/i).map((part) => part.trim()).filter(Boolean);
  const errors: string[] = [];
  for (const option of options) {
    try {
      await pom.expectTableContains(option);
      return;
    } catch (error) {
      errors.push(String(error));
    }
  }
  throw new Error(errors.join(" | ") || `None of [${options.join(", ")}] was found`);
}

function savedExport(page: Page, missing: string): string {
  const filePath = lastExport.get(page);
  if (!filePath) {
    throw new Error(missing);
  }
  return filePath;
}

export async function assertTableOmits(pom: BasePage, text: string, label: string): Promise<void> {
  const rows = pom.tableRows();
  const count = await rows.count();
  for (let i = 0; i < count; i += 1) {
    const rowText = ((await rows.nth(i).innerText()) || "").replace(/\s+/g, " ");
    if (rowText.includes(text) && !rowText.includes("No data")) {
      throw new Error(`${label} still lists ${text}`);
    }
  }
}

export async function downloadExport(pom: BasePage, button: Locator): Promise<string> {
  const [download] = await Promise.all([
    pom.page.waitForEvent("download", { timeout: 60_000 }),
    button.click(),
  ]);
  const target = path.join(os.tmpdir(), `adad-${Date.now()}-${download.suggestedFilename()}`);
  await download.saveAs(target);
  lastExport.set(pom.page, target);
  logger.info(`Downloaded ${target}`);
  return target;
}

export async function assertLastExportMatchesGrid(pom: BasePage, root?: Locator): Promise<void> {
  const filePath = savedExport(pom.page, "No export was downloaded earlier in this scenario");
  const body = fs.readFileSync(filePath, "utf8");
  if (!body.trim()) {
    throw new Error(`Export is empty: ${filePath}`);
  }
  await pom.expectTableHasRows(root);
  const rowText = ((await pom.tableRows(root).first().innerText()) || "").replace(/\s+/g, " ").trim();
  const tokens = rowText.split(/\s+/).filter((token) => token.length >= 3);
  if (!tokens.some((token) => body.includes(token))) {
    throw new Error(`Export does not contain the first grid row. Row: ${rowText}`);
  }
}

export function lastExportPath(page: Page): string | undefined {
  return lastExport.get(page);
}

export async function assertLastExportHasLines(pom: BasePage, minimumLines: number): Promise<void> {
  const filePath = savedExport(pom.page, "No export was downloaded earlier in this scenario");
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < minimumLines) {
    throw new Error(`Export has ${lines.length} lines, expected at least ${minimumLines}`);
  }
}

export async function clearFilters(pom: BasePage): Promise<void> {
  const clear = pom.page.getByRole("button", { name: /^(clear|reset|reset all)$/i });
  if (await clear.first().isVisible().catch(() => false)) {
    await clear.first().click();
    logger.info("Cleared filters with the clear action");
    return;
  }
  const boxes = pom.page.getByRole("textbox");
  const count = await boxes.count();
  for (let i = 0; i < count; i += 1) {
    const box = boxes.nth(i);
    if (await box.isVisible().catch(() => false)) {
      await box.fill("");
    }
  }
  logger.info("Cleared visible filter inputs");
}

export async function clickNamed(pom: BasePage, name: RegExp): Promise<void> {
  const button = pom.page.getByRole("button", { name }).or(pom.page.getByRole("menuitem", { name }));
  await expect(button.first(), `Missing action ${name}`).toBeVisible();
  await button.first().click();
}

export async function confirmAction(pom: BasePage, name: RegExp): Promise<void> {
  await clickNamed(pom, name);
  await confirmYes(pom);
}

export async function confirmYes(pom: BasePage): Promise<void> {
  const yes = pom.page.getByRole("button", { name: /^(yes|confirm|ok)$/i });
  if (await yes.first().isVisible().catch(() => false)) {
    await yes.first().click();
  }
}

export async function assertText(pom: BasePage, text: string, root?: Locator): Promise<void> {
  const scope = root ?? pom.page;
  await expect(scope.getByText(text, { exact: false }).first()).toBeVisible();
}

export async function openFirstDetails(pom: BasePage, root?: Locator): Promise<void> {
  const scope = root ?? pom.page;
  const view = scope.getByRole("button").filter({ has: pom.page.locator(".pi-eye") }).first();
  if (await view.isVisible().catch(() => false)) {
    await view.click();
    return;
  }
  await pom.tableRows(root).first().click();
}

export async function assertDetailsContain(pom: BasePage, fragments: string[], root?: Locator): Promise<void> {
  await openFirstDetails(pom, root);
  if (fragments.length === 0) {
    await expect(pom.page.locator(".p-dialog, .p-sidebar, adad-frontend-audit-track-details").first()).toBeVisible();
    return;
  }
  for (const fragment of fragments) {
    await assertText(pom, fragment);
  }
}

export function dropdownByLabel(pom: BasePage, label: RegExp): Locator {
  return pom.page.locator("p-dropdown, p-multiselect").filter({ has: pom.page.getByText(label) }).first();
}
