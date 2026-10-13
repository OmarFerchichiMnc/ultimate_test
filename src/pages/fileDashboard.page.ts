import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { looksLikeFileName } from "./scenarioSupport";

export class FileDashboardPage extends BasePage {
  static readonly path = "/etl-files";
  static testPoints(): TestPoint[] {
    return [
      new OpenFileDashboardPage(),
      new InspectFileDashboardDateRange(),
      new InspectFileDashboardExtraFiltersButton(),
      new InspectFileDashboardSearch(),
      new InspectFileDashboardExportButton(),
      new InspectFileDashboardCopy(),
      new InspectFileDashboardLoadMore(),
      new InspectFileDashboardPaginatorFirst(),
      new InspectFileDashboardPaginatorPrev(),
      new InspectFileDashboardPaginatorPage1(),
      new InspectFileDashboardPaginatorNext(),
      new InspectFileDashboardPaginatorLast(),
    ];
  }

  readonly dateRange: Locator;
  readonly extraFiltersButton: Locator;
  readonly search: Locator;
  readonly exportButton: Locator;
  readonly copy: Locator;
  readonly loadMore: Locator;
  readonly paginatorFirst: Locator;
  readonly paginatorPrev: Locator;
  readonly paginatorPage1: Locator;
  readonly paginatorNext: Locator;
  readonly paginatorLast: Locator;
  readonly dateRangeInput: Locator;
  readonly fileIdInput: Locator;
  readonly fileNameInput: Locator;

  constructor(page: Page) {
    super(page, FileDashboardPage.path);
    this.dateRange = this.findCalendarTrigger();
    this.extraFiltersButton = this.findExtraFilters();
    this.search = this.findNamedButton("Search", 0);
    this.exportButton = this.findExportButton();
    this.copy = this.findCopyButton();
    this.loadMore = this.findNamedButton("Load more");
    this.paginatorFirst = this.findPaginatorFirst();
    this.paginatorPrev = this.findPaginatorPrev();
    this.paginatorPage1 = this.findPaginatorPage("1");
    this.paginatorNext = this.findPaginatorNext();
    this.paginatorLast = this.findPaginatorLast();
    this.dateRangeInput = this.page.getByPlaceholder("Select file reception date range", { exact: true });
    this.fileIdInput = this.page.getByPlaceholder("File ID", { exact: true });
    this.fileNameInput = this.page.getByRole("textbox", { name: "File Name", exact: true });
  }
}

export class OpenFileDashboardPage extends TestPoint {
  constructor() {
    super("TP-OPEN-ETL_FILES", "Open /etl-files", async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.goto();
      await pom.expectOnPage();
    });
  }
}

export class InspectFileDashboardDateRange extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-01",
      "Inspect \"pi pi-calendar\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.dateRange, "TP-BTN-ETL_FILES-01 pi pi-calendar on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardExtraFiltersButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-02",
      "Inspect \"pi pi-filter\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.extraFiltersButton, "TP-BTN-ETL_FILES-02 pi pi-filter on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardSearch extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-03",
      "Inspect \"Search\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.search, "TP-BTN-ETL_FILES-03 Search on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardExportButton extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-04",
      "Inspect \"Export\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.exportButton, "TP-BTN-ETL_FILES-04 Export on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardCopy extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-05",
      "Inspect \"pi pi-copy\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.copy, "TP-BTN-ETL_FILES-05 pi pi-copy on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardLoadMore extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-06",
      "Inspect \"Load more\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.loadMore, "TP-BTN-ETL_FILES-06 Load more on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardPaginatorFirst extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-07",
      "Inspect \"paginator:pi pi-angle-double-left\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.paginatorFirst, "TP-BTN-ETL_FILES-07 paginator:pi pi-angle-double-left on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardPaginatorPrev extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-08",
      "Inspect \"paginator:pi pi-angle-left\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.paginatorPrev, "TP-BTN-ETL_FILES-08 paginator:pi pi-angle-left on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardPaginatorPage1 extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-09",
      "Inspect \"paginator:1\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.paginatorPage1, "TP-BTN-ETL_FILES-09 paginator:1 on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardPaginatorNext extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-10",
      "Inspect \"paginator:pi pi-angle-right\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.paginatorNext, "TP-BTN-ETL_FILES-10 paginator:pi pi-angle-right on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class InspectFileDashboardPaginatorLast extends TestPoint {
  constructor() {
    super(
      "TP-BTN-ETL_FILES-11",
      "Inspect \"paginator:pi pi-angle-double-right\" on /etl-files",
      async (page) => {
        const pom = new FileDashboardPage(page);
        await pom.expectVisible(pom.paginatorLast, "TP-BTN-ETL_FILES-11 paginator:pi pi-angle-double-right on /etl-files");
      },
      "*****",
      "ready",
    );
  }
}

export class FileDashboardUIFilterExpectedFileReceptionDate extends TestPoint {
  constructor(date: string) {
    super("TP0500", "Filter expected file reception date within file dashboard page", async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.expectOnPage();
      await pom.fillDateRange(pom.dateRangeInput, date);
    });
  }
}

export class FileDashboardUIAddFilters extends TestPoint {
  constructor() {
    super("TP0502", "Add other ui filters within file dashboard page", async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.expectOnPage();
      const className = (await pom.extraFiltersButton.getAttribute("class")) ?? "";
      if (!className.includes("p-button-icon-only") || className.includes("p-button-outlined")) {
        await pom.extraFiltersButton.click();
      }
    });
  }
}

export class FileDashboardUIFilterFileID extends TestPoint {
  constructor(fileId: string) {
    super("TP0503", "Filter File ID within file dashboard page", async (page) => {
      if (looksLikeFileName(fileId)) {
        throw new Error(`File ID filter received a file name (${fileId}). Look up the assigned file id first.`);
      }
      const pom = new FileDashboardPage(page);
      await pom.expectOnPage();
      await new FileDashboardUIAddFilters().run(page);
      await pom.fileIdInput.fill(fileId);
      await pom.fileIdInput.press("Enter");
    });
  }
}

export class FileDashboardFilterUploadedFile extends TestPoint {
  constructor(fileName: string) {
    super("TP0503", `Filter File Name ${fileName} within file dashboard page`, async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.expectOnPage();
      await new FileDashboardUIAddFilters().run(page);
      await pom.fileIdInput.fill("");
      await pom.fileNameInput.fill(fileName);
    });
  }
}

export class FileDashboardUIFilterClickSearch extends TestPoint {
  constructor() {
    super("TP0508", "Click search within file dashboard page", async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.expectOnPage();
      await pom.search.click();
      logger.info("Clicked search on file dashboard");
    });
  }
}

export class CheckIfFileIngested extends TestPoint {
  constructor(fileName: string) {
    super("TP0510", "Check if file ingested within file dashboard page", async (page) => {
      const pom = new FileDashboardPage(page);
      await pom.expectOnPage();
      await pom.expectTableContains(fileName, 2);
    });
  }
}
