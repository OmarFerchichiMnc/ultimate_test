import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { config } from "../../src/configuration/config";
import { GenerateBankReconciliationFiles, bankReconciliationDataset } from "../../src/generation";
import { PrepareIngestionFixture, OpenFileDashboardPage, FileDashboardFilterUploadedFile, FileDashboardUIFilterClickSearch, FileDashboardWaitForFile, FileDashboardAssertIngestionStatus, OpenBankReconciliationSettingsPage, BankReconciliationClickTriggerNow, OpenMatchedItemsPage, MatchedItemsSelectReconciliation, MatchedItemsFilterDateRange, MatchedItemsClickSearch, MatchedItemsWaitForBankMolecules, MatchedItemsAssertMoleculeStatus, MatchedItemsOpenMolecule, MatchedItemsWaitForMoleculeDetails, OpenPaymentOrderAuditTrackPage, PaymentOrderUIFilterPaymentOrderReference, PaymentOrderUIClickSearch, PaymentOrderUICheckIfTableHasReference, PaymentOrderAuditTrackAssertLifecycleEvents, OpenBankAuditTrackPage, BankUIFilterBankDepositReference, BankUIClickSearch, BankUICheckIfTableHasReference, BankAuditTrackAssertLifecycleEvents } from "../../src/pages";
import { BastionSsmForward, PrepareUpload, ExecuteUpload, WaitForFileInjection } from "../../src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
  test("MR-07 Bank reconciliation level 3, mono-currency", async ({ loggedInPage }) => {
    test.setTimeout(900_000);
    // Bank reconciliation: payment orders (acquirer settlement JSONL) vs bank deposits (bank statement JSONL).
    // Each payment order has one bank deposit with the same bank deposit reference, amount and currency.
    const data = bankReconciliationDataset("MR-07");
    await runTestPoints(loggedInPage, [
      new GenerateBankReconciliationFiles(data),
      new PrepareIngestionFixture(data.dir),

      // Payment order file
      new BastionSsmForward(),
      new PrepareUpload(data.dir, config.adadPaths.settlement, data.paymentOrder.fileName),
      new ExecuteUpload(data.dir, config.adadPaths.settlement, data.paymentOrder.fileName),

      // Bank deposit file
      new PrepareUpload(data.dir, config.adadPaths.bankDeposit, data.bankDeposit.fileName),
      new ExecuteUpload(data.dir, config.adadPaths.bankDeposit, data.bankDeposit.fileName),

      new WaitForFileInjection(),

      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(data.paymentOrder.fileName),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardWaitForFile(data.paymentOrder.fileName),
      new FileDashboardAssertIngestionStatus("Accepted"),

      // Bank deposit file


      new OpenFileDashboardPage(),
      new FileDashboardFilterUploadedFile(data.bankDeposit.fileName),
      new FileDashboardUIFilterClickSearch(),
      new FileDashboardWaitForFile(data.bankDeposit.fileName),
      new FileDashboardAssertIngestionStatus("Accepted"),

      // Bank reconciliation
      new OpenBankReconciliationSettingsPage(),
      new BankReconciliationClickTriggerNow(),
      new OpenMatchedItemsPage(),
      new MatchedItemsSelectReconciliation("Bank Reconciliation"),
      new MatchedItemsFilterDateRange(data.paymentDateRange),
      new MatchedItemsClickSearch(),
      new MatchedItemsWaitForBankMolecules(data.pairs.map((pair) => pair.amount), data.currency),
      new MatchedItemsAssertMoleculeStatus("ACCEPTED or COMPLETE or BANKED"),
      new MatchedItemsOpenMolecule(),
      new MatchedItemsWaitForMoleculeDetails("0.00"),

      // Audit tracks
      new OpenPaymentOrderAuditTrackPage(),
      // The reference is an Advanced Filters field, so use the Advanced Filters Search (not the quick search)
      new PaymentOrderUIFilterPaymentOrderReference(data.paymentOrderReference),
      new PaymentOrderUIClickSearch(),
      // The grid shows the internal Payment Order ID, not the reference: check the row by the
      // bank deposit reference it carries (unique to this payment order).
      new PaymentOrderUICheckIfTableHasReference(data.bankDepositReference),
      new PaymentOrderAuditTrackAssertLifecycleEvents([]),
      new OpenBankAuditTrackPage(),
      new BankUIFilterBankDepositReference(data.bankDepositReference),
      new BankUIClickSearch(),
      new BankUICheckIfTableHasReference(data.bankDepositReference),
      new BankAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
