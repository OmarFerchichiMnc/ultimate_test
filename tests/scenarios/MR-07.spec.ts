import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, CheckIfFileIngested, FileDashboardAssertIngestionStatus, FileDashboardAssertTotalTransactions, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, OpenMatchedItemsPage, MatchedItemsSelectReconciliation, MatchedItemsFilterDateRange, MatchedItemsClickSearch, MatchedItemsAssertMoleculeStatus, MatchedItemsAssertAtomsLinked, OpenPaymentOrderAuditTrackPage, PaymentOrderUIFilterPaymentOrderReference, PaymentOrderUIClickSearchQuickFilter, PaymentOrderAuditTrackAssertLifecycleEvents, OpenBankAuditTrackPage, BankUIFilterBankDepositReference, BankUIClickSearchQuickFilter, BankAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-07 Bank reconciliation level 3, mono-currency", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new PrepareIngestionFixture(config.files.salePath),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(config.files.saleFileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(config.files.saleFileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(20),
      new BastionSsmForward(),
      new PrepareUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new ExecuteUpload(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
      new WaitForFileInjection(),
      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(config.files.saleFileName),
      new FileDashboardUIFilterClickSearch(),
      new CheckIfFileIngested(config.files.saleFileName),
      new FileDashboardAssertIngestionStatus("Accepted"),
      new FileDashboardAssertTotalTransactions(20),
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new OpenMatchedItemsPage(),
      new MatchedItemsSelectReconciliation("Bank Reconciliation"),
      new MatchedItemsFilterDateRange("01/01/2026 - 31/01/2026"),
      new MatchedItemsClickSearch(),
      new MatchedItemsAssertMoleculeStatus("Accepted"),
      new MatchedItemsAssertAtomsLinked("0.00"),
      new OpenPaymentOrderAuditTrackPage(),
      new PaymentOrderUIFilterPaymentOrderReference("Q8E3G2"),
      new PaymentOrderUIClickSearchQuickFilter(),
      new PaymentOrderAuditTrackAssertLifecycleEvents([]),
      new OpenBankAuditTrackPage(),
      new BankUIFilterBankDepositReference("Q8E3G2"),
      new BankUIClickSearchQuickFilter(),
      new BankAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
