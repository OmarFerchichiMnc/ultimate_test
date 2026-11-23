// TestPoints used by the scenario specs (reports). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import fs from "fs";
import { TestPoint } from "../testpoint/TestPoint";
import { ReportsPage } from "../pages/reports.page";
import { lastExportPath, downloadExport, exportButton } from "../pages/scenarioSupport";

export class ReportsFilterAndExport extends TestPoint {
  constructor(reportText: string, id: string) {
    super("TP-NEW-099", `Export report ${reportText} for ${id}`, async (page) => {
      const pom = new ReportsPage(page);
      const report = pom.page.getByText(reportText, { exact: false }).first();
      if (await report.isVisible().catch(() => false)) {
        await report.click();
      }
      const box = pom.page.getByRole("textbox").first();
      await box.fill(id);
      await pom.search.click();
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class ReportsAssertCoherence extends TestPoint {
  constructor(expected: string) {
    super("TP-NEW-100", `Assert report contains ${expected}`, async (page) => {
      const filePath = lastExportPath(page);
      if (!filePath) {
        throw new Error("No report export was downloaded earlier in this scenario");
      }
      const body = fs.readFileSync(filePath, "utf8");
      if (!body.includes(expected)) {
        throw new Error(`Report export does not contain '${expected}'`);
      }
    });
  }
}
