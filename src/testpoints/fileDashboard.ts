// TestPoints used by the scenario specs (fileDashboard). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import fs from "fs";
import path from "path";
import { logger } from "../configuration/logger";
import { TestPoint } from "../testpoint/TestPoint";
import { FileDashboardPage } from "../pages/fileDashboard.page";
import {
  assertColumn,
  assertLastExportMatchesGrid,
  cellByHeader,
  assertText,
  clearFilters,
  downloadExport,
  dropdownByLabel,
  exportButton,
} from "../pages/scenarioSupport";

export class PrepareIngestionFixture extends TestPoint {
  constructor(fixturePath: string) {
    super("TP-NEW-001", `Prepare ingestion fixture ${fixturePath}`, async () => {
      const full = path.isAbsolute(fixturePath) ? fixturePath : path.resolve(process.cwd(), fixturePath);
      if (!fs.existsSync(full)) {
        throw new Error(`Ingestion fixture not found: ${full}`);
      }
      const stat = fs.statSync(full);
      if (stat.isDirectory() && fs.readdirSync(full).filter((name) => !name.startsWith(".")).length === 0) {
        throw new Error(`Ingestion fixture directory is empty: ${full}`);
      }
      logger.info(`Ingestion fixture ready: ${full}`);
    });
  }
}

export class FileDashboardAssertIngestionStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-002", `Assert file ingestion status ${status}`, async (page) => {
      await assertColumn(new FileDashboardPage(page), /status/i, status);
    });
  }
}

export class FileDashboardAssertTotalTransactions extends TestPoint {
  /**
   * The File Dashboard "Total" cell reads like "10 Eligible: 10 Not Eligible: 0".
   * `expectedCount` is checked against the total; pass `expectedEligible` to also
   * require that many eligible rows (and the rest not eligible).
   */
  constructor(expectedCount: number, expectedEligible?: number) {
    const label =
      expectedEligible === undefined
        ? `Assert total transactions is ${expectedCount}`
        : `Assert total transactions is ${expectedCount} (eligible ${expectedEligible})`;
    super("TP-NEW-003", label, async (page) => {
      const actual = await cellByHeader(new FileDashboardPage(page), /total/i);
      const counts = parseTransactionCounts(actual);
      const errors: string[] = [];
      if (counts.total !== expectedCount) errors.push(`total ${counts.total ?? "?"} instead of ${expectedCount}`);
      if (expectedEligible !== undefined) {
        if (counts.eligible !== expectedEligible) {
          errors.push(`eligible ${counts.eligible ?? "?"} instead of ${expectedEligible}`);
        }
        const expectedNotEligible = expectedCount - expectedEligible;
        if (counts.notEligible !== undefined && counts.notEligible !== expectedNotEligible) {
          errors.push(`not eligible ${counts.notEligible} instead of ${expectedNotEligible}`);
        }
      }
      if (errors.length) {
        throw new Error(`File Dashboard transactions: ${errors.join(", ")} (cell '${actual}')`);
      }
      logger.info(`Total transactions is ${actual}`);
    });
  }
}

export type TransactionCounts = { total?: number; eligible?: number; notEligible?: number };

/** Parses "10 Eligible: 10 Not Eligible: 0" (or a bare "10"). */
export function parseTransactionCounts(text: string): TransactionCounts {
  const clean = text.replace(/\s+/g, " ").trim();
  const num = (match: RegExpMatchArray | null) => (match ? Number(match[1]) : undefined);
  return {
    total: num(clean.match(/^(\d+)/)),
    eligible: num(clean.match(/(?<!not )eligible\s*:?\s*(\d+)/i)),
    notEligible: num(clean.match(/not eligible\s*:?\s*(\d+)/i)),
  };
}

export class FileDashboardFilterIngestionStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-004", `Filter file dashboard by status ${status}`, async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.selectDropdownOption(dropdownByLabel(pom, /status/i), status);
    });
  }
}

export class FileDashboardFilterDatasource extends TestPoint {
  constructor(datasource: string) {
    super("TP-NEW-005", `Filter file dashboard by datasource ${datasource}`, async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.selectDropdownOption(dropdownByLabel(pom, /datasource|source/i), datasource);
    });
  }
}

export class FileDashboardClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-006", "Clear File Dashboard filters", async (page) => {
      await clearFilters(new FileDashboardPage(page));
    });
  }
}

export class FileDashboardClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-007", "Export the File Dashboard grid", async (page) => {
      const pom = new FileDashboardPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class FileDashboardAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-008", "Assert the File Dashboard export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new FileDashboardPage(page));
    });
  }
}

export class FileDashboardUploadRecoveryFile extends TestPoint {
  constructor(filePath: string) {
    super("TP-NEW-009", `Upload recovery file ${filePath}`, async (page) => {
      const pom = new FileDashboardPage(page);
      const full = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      await pom.page.locator("input[type=file]").first().setInputFiles(full);
      logger.info(`Recovery file selected: ${full}`);
    });
  }
}

export class FileDashboardAssertRecoveryBadge extends TestPoint {
  constructor() {
    super("TP-NEW-010", "Assert the recovered file is Accepted", async (page) => {
      const pom = new FileDashboardPage(page);
      await assertText(pom, "recovery");
      await assertColumn(pom, /status/i, "Accepted");
    });
  }
}
