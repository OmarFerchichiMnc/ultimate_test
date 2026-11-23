// TestPoints used by the scenario specs (alerts). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { TestPoint } from "../testpoint/TestPoint";
import { AlertsPage } from "../pages/alerts.page";
import { assertLastExportMatchesGrid, clearFilters, downloadExport, exportButton } from "../pages/scenarioSupport";

export class AlertsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-042", `Filter alerts by ${date}`, async (page) => {
      const pom = new AlertsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class AlertsApplyCombinedFilters extends TestPoint {
  constructor(category: string, type: string) {
    super("TP-NEW-043", `Filter alerts by ${category} / ${type}`, async (page) => {
      const pom = new AlertsPage(page);
      await pom.selectDropdownOption(pom.selectCategory, category);
      await pom.selectDropdownOption(pom.selectType, type);
    });
  }
}

export class AlertsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-044", "Click Search on Alerts", async (page) => {
      await new AlertsPage(page).search.click();
    });
  }
}

export class AlertsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-045", "Clear Alerts filters", async (page) => {
      await clearFilters(new AlertsPage(page));
    });
  }
}

export class AlertsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-046", "Export alerts", async (page) => {
      const pom = new AlertsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class AlertsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-047", "Assert the alerts export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new AlertsPage(page));
    });
  }
}

export class AlertsAssertMissingFile extends TestPoint {
  constructor(fileName: string) {
    super("TP-NEW-048", `Assert missing-file alert for ${fileName}`, async (page) => {
      const pom = new AlertsPage(page);
      await pom.expectTableContains(fileName);
    });
  }
}
