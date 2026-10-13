import { expect, Locator, Page } from "@playwright/test";
import { logger } from "../configuration/logger";

export function pathMatches(url: URL, path: string): boolean {
  const actual = url.pathname.replace(/\/$/, "") || "/";
  const expected = path.replace(/\/$/, "") || "/";
  return actual === expected;
}

function parseEuropeanDate(value: string): Date {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function assertMaxOneMonth(start: Date, end: Date): void {
  const limit = new Date(start);
  limit.setMonth(limit.getMonth() + 1);
  if (end > limit) {
    throw new Error(
      `Date range cannot exceed 1 month: ${start.toDateString()} - ${end.toDateString()}`,
    );
  }
}

export class BasePage {
  constructor(
    public readonly page: Page,
    public readonly path: string,
  ) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: "domcontentloaded" });
    await this.expectOnPage();
    await this.page.locator("adad-frontend-layout, app-root").first().waitFor({ state: "visible" });
  }

  async expectOnPage(): Promise<void> {
    await expect(this.page).toHaveURL((url) => pathMatches(url, this.path));
  }

  async expectVisible(locator: Locator, label: string): Promise<void> {
    await expect(locator.first(), label).toBeVisible({ timeout: 10_000 });
  }

  protected findNamedButton(name: string | RegExp, index = 0): Locator {
    return this.page.getByRole("button", { name }).nth(index);
  }

  protected findTab(label: string, index = 0): Locator {
    return this.page.getByRole("button", { name: label, exact: true }).nth(index);
  }

  protected findRadio(label: string, root?: Locator): Locator {
    return (root ?? this.page).getByText(label, { exact: true }).filter({ visible: true });
  }

  protected findCalendarTrigger(index = 0): Locator {
    return this.page.locator("adad-frontend-date-range").locator("button").nth(index);
  }

  protected findExtraFilters(): Locator {
    return this.page.getByRole("button").filter({ has: this.page.locator(".pi-filter") }).first();
  }

  gridExportButton(): Locator {
    return this.page.locator("button.GUiExportButton").first();
  }

  protected findExportButton(): Locator {
    return this.gridExportButton();
  }

  protected findCopyButton(): Locator {
    return this.page.locator("button.GuiClipboardCopyButton");
  }

  protected findIconButton(iconClass: string, index = 0): Locator {
    return this.page.getByRole("button").filter({ has: this.page.locator(`.${iconClass}`) }).nth(index);
  }

  protected findDropdown(label: string, index = 0): Locator {
    return this.page
      .locator("p-dropdown, p-multiselect")
      .filter({
        has: this.page.getByPlaceholder(label, { exact: true }).or(this.page.getByText(label, { exact: true })),
      })
      .nth(index);
  }

  protected findPaginatorFirst(): Locator {
    return this.page.locator("button.p-paginator-first");
  }

  protected findPaginatorPrev(): Locator {
    return this.page.locator("button.p-paginator-prev");
  }

  protected findPaginatorNext(): Locator {
    return this.page.locator("button.p-paginator-next");
  }

  protected findPaginatorLast(): Locator {
    return this.page.locator("button.p-paginator-last");
  }

  protected findPaginatorPage(pageNumber: string): Locator {
    return this.page.locator("button.p-paginator-page").filter({ hasText: pageNumber }).first();
  }

  tableRows(root?: Locator): Locator {
    const scope = root ?? this.page;
    return scope.getByRole("row").filter({ has: this.page.getByRole("cell") });
  }

  async selectDropdownOption(dropdown: Locator, option: string): Promise<void> {
    if (!option) {
      logger.info("Skipping empty dropdown option");
      return;
    }
    await dropdown.click();
    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible();
    const exact = options.filter({ hasText: new RegExp(`^${option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) });
    const match = (await exact.count()) ? exact.first() : options.filter({ hasText: option }).first();
    if (!(await match.count())) {
      const available = (await options.allInnerTexts()).map((text) => text.replace(/\s+/g, " ").trim()).join(" | ");
      throw new Error(`Dropdown option '${option}' not found. Options: ${available}`);
    }
    await match.click();
    logger.info(`Option '${option}' selected`);
  }

  async fillDateRange(input: Locator, date: string): Promise<void> {
    const [startText, endText] = date.split("-").map((part) => part.trim());
    const start = parseEuropeanDate(startText);
    const end = parseEuropeanDate(endText);
    assertMaxOneMonth(start, end);
    const calendar = input.locator("xpath=ancestor::p-calendar[1]");
    await calendar.getByRole("button").first().click();
    const panel = this.page.locator(".p-datepicker").last();
    await expect(panel).toBeVisible();
    await this.pickCalendarDay(panel, start);
    await this.pickCalendarDay(panel, end);
    if (await panel.isVisible().catch(() => false)) {
      await this.page.getByText("Advanced Filters").click({ force: true });
    }
    await expect(input).toHaveValue(/\d{4}/);
    logger.info(`Date '${date}' entered`);
  }

  async fillCalendarTrigger(trigger: Locator, date: string): Promise<void> {
    const [startText, endText] = date.split("-").map((part) => part.trim());
    const start = parseEuropeanDate(startText);
    const end = parseEuropeanDate(endText);
    assertMaxOneMonth(start, end);
    await trigger.click();
    const panel = this.page.locator(".p-datepicker").last();
    await expect(panel).toBeVisible();
    await this.pickCalendarDay(panel, start);
    await this.pickCalendarDay(panel, end);
    if (await panel.isVisible().catch(() => false)) {
      const heading = this.page.getByText("Advanced Filters");
      if (await heading.isVisible().catch(() => false)) {
        await heading.click({ force: true });
      } else {
        await this.page.keyboard.press("Escape");
      }
    }
    logger.info(`Date '${date}' entered from calendar trigger`);
  }

  private async pickCalendarDay(panel: Locator, date: Date): Promise<void> {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const targetMonth = months[date.getMonth()];
    const targetYear = String(date.getFullYear());
    for (let i = 0; i < 48; i += 1) {
      const title = ((await panel.locator(".p-datepicker-title").first().innerText()) || "").replace(/\s+/g, " ");
      if (title.includes(targetMonth) && title.includes(targetYear)) break;
      const yearMatch = title.match(/(\d{4})/);
      const currentYear = yearMatch ? Number(yearMatch[1]) : date.getFullYear();
      const currentMonth = months.findIndex((month) => title.includes(month));
      const current = currentYear * 12 + Math.max(currentMonth, 0);
      const target = date.getFullYear() * 12 + date.getMonth();
      if (current <= target) {
        await panel.getByRole("button", { name: /next month/i }).or(panel.locator("button.p-datepicker-next")).first().click();
      } else {
        await panel.getByRole("button", { name: /previous month/i }).or(panel.locator("button.p-datepicker-prev")).first().click();
      }
    }
    await panel
      .locator("td:not(.p-datepicker-other-month)")
      .filter({ hasText: new RegExp(`^${date.getDate()}$`) })
      .first()
      .click({ force: true });
  }

  async expectTableHasRows(root?: Locator): Promise<void> {
    const scope = root ?? this.page;
    const noData = scope.getByText("No data", { exact: true });
    const rows = this.tableRows(root);
    await expect(rows.first()).toBeVisible();
    if (await noData.isVisible().catch(() => false)) {
      throw new Error("Table is empty (No data)");
    }
    expect(await rows.count()).toBeGreaterThan(0);
  }

  async expectTableEmpty(root?: Locator): Promise<void> {
    const scope = root ?? this.page;
    await expect(scope.getByText("No data", { exact: true })).toBeVisible();
  }

  async tableHeaders(root?: Locator): Promise<string[]> {
    const headers = (root ?? this.page).getByRole("columnheader");
    const count = await headers.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i += 1) {
      texts.push(((await headers.nth(i).innerText()) || "").replace(/\s+/g, " ").trim());
    }
    return texts;
  }

  async firstRowCellByHeader(header: string | RegExp, root?: Locator): Promise<string> {
    await this.expectTableHasRows(root);
    const headers = await this.tableHeaders(root);
    const index = headers.findIndex((text) =>
      typeof header === "string" ? text.toLowerCase().includes(header.toLowerCase()) : header.test(text),
    );
    if (index < 0) {
      throw new Error(`Column ${header} not found. Headers: ${headers.join(" | ")}`);
    }
    const cell = this.tableRows(root).first().getByRole("cell").nth(index);
    const value = ((await cell.innerText()) || "").replace(/\s+/g, " ").trim();
    if (!value || value === "No data") {
      throw new Error(`Column ${header} is empty on the first row`);
    }
    logger.info(`Read '${value}' from column ${headers[index]}`);
    return value;
  }

  async expectTableContains(expected: string, columnIndex = 2): Promise<void> {
    const rows = this.tableRows();
    await expect(rows.first()).toBeVisible();
    const count = await rows.count();
    let found = false;
    for (let i = 0; i < count; i += 1) {
      const cells = (await rows.nth(i).innerText())
        .split(/[\t\n]+/)
        .map((cell) => cell.trim())
        .filter(Boolean);
      logger.info(`Row ${i + 1}: ${cells.join(" | ")}`);
      if (cells[columnIndex] === expected || cells.includes(expected)) {
        found = true;
      }
    }
    if (!found) {
      throw new Error(`Value '${expected}' not found in table`);
    }
  }
}
