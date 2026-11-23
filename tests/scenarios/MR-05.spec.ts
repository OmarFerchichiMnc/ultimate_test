import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { GenerateScenarioFiles, scenarioDataset } from "../../src/generation";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, FileDashboardWaitForFile, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, DbShiftSaleCreatedDatesByDocument, OpenSecondaryMatchingSettingsPage, SecondaryMatchingClickTriggerNow, OpenSecondaryMatchingPage, SecondaryMatchingWaitForSaleRefundPairs, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUIOpenRefundedSalesTab, SaleUICheckIfSaleTableHasDocument, SaleAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection, WaitForThirtySeconds } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-05 Secondary matching: sale and refund", async ({ loggedInPage }) => {
    test.setTimeout(1000_000);
    // Sale file holds each SALE row and its REFUND row (same document number).
    const data = scenarioDataset("MR-05", { strategy: "documentNumberAndFop", withRefunds: true });
    const documentNumbers = data.sales.map((sale) => sale.documentNumber);
    await runTestPoints(loggedInPage, [
      new GenerateScenarioFiles(data),
      new PrepareIngestionFixture(data.dir),

      new BastionSsmForward(),
      new PrepareUpload(data.dir, config.adadPaths.sales, data.sale.fileName),
      new ExecuteUpload(data.dir, config.adadPaths.sales, data.sale.fileName),

      new WaitForFileInjection(),

      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(data.sale.fileName),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardWaitForFile(data.sale.fileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(data.sale.count, data.sale.eligible),

      // created_date = created_date - interval '61 day' for this run's sales and refunds
      new DbShiftSaleCreatedDatesByDocument(documentNumbers, 61),

      new OpenSecondaryMatchingSettingsPage(),
      new WaitForThirtySeconds(),
      new SecondaryMatchingClickTriggerNow(),
      new OpenSecondaryMatchingPage(),
      new WaitForThirtySeconds(),
      // The grid shows amounts, not document numbers: one balanced molecule per sale amount.
      new SecondaryMatchingWaitForSaleRefundPairs(data.sales.map((sale) => sale.amount), data.currency),

      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber(data.documentNumber),
      new SaleUIClickSearchQuickFilter(),
      // Sales that were refunded (and their refunds) are listed under "Refunded Sales", not "Sales".
      new SaleUIOpenRefundedSalesTab(),
      new SaleUICheckIfSaleTableHasDocument(data.documentNumber),
      new SaleAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
