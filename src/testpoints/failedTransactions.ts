// TestPoints used by the scenario specs (failedTransactions). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { TestPoint } from "../testpoint/TestPoint";
import { FailedTransactionsPage } from "../pages/failedTransactions.page";
import { assertLastExportMatchesGrid, clearFilters, downloadExport, exportButton } from "../pages/scenarioSupport";

export class FailedTransactionsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-012", `Filter failed transactions by ${date}`, async (page) => {
      const pom = new FailedTransactionsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class FailedTransactionsApplyCombinedFilters extends TestPoint {
  constructor(channelType: string, datasource: string) {
    super("TP-NEW-013", "Apply failed-transaction status and datasource filters", async (page) => {
      const pom = new FailedTransactionsPage(page);
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
      await pom.selectDropdownOption(pom.saleSource, datasource);
    });
  }
}

export class FailedTransactionsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-014", "Click Search on Failed Transactions", async (page) => {
      await new FailedTransactionsPage(page).search.click();
    });
  }
}

export class FailedTransactionsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-015", "Clear Failed Transactions filters", async (page) => {
      await clearFilters(new FailedTransactionsPage(page));
    });
  }
}

export class FailedTransactionsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-016", "Export failed transactions", async (page) => {
      const pom = new FailedTransactionsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class FailedTransactionsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-017", "Assert the failed-transactions export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new FailedTransactionsPage(page));
    });
  }
}

export class FailedTransactionsAssertRecordStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-018", `Assert failed record status ${status}`, async (page) => {
      await new FailedTransactionsPage(page).expectTableContains(status);
    });
  }
}
