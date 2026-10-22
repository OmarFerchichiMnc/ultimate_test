import { test } from "../../src/fixtures/auth";
import { buildSaleRefundPair } from "../../src/configuration/saleRefundPair";
import {
    AssertSaleRefundThresholds,
    CheckIfFileIngested,
    DbShiftSaleRefundCreatedDates,
    FileDashboardAssertIngestionStatus,
    FileDashboardFilterUploadedFile,
    FileDashboardUIFilterClickSearch,
    OpenFileDashboardPage,
    OpenSaleAuditTrackPage,
    OpenSecondaryMatchingPage,
    OpenSecondaryMatchingRulesPage,
    OpenSecondaryMatchingSettingsPage,
    SaleAuditTrackAssertSaleRefundData,
    SecondaryMatchingAssertDocumentReference,
    SecondaryMatchingClickTriggerNow,
    UploadSaleRefundPair,
} from "../../src/pages";
import { runTestPoints } from "../runTestPoints";
import { WaitForFileInjection } from "src/configuration/fileInjection";

test.describe("Matching & Reconciliation", () => {
    test("MR-47 Secondary matching sale and refund advanced matching", async ({ loggedInPage }) => {
        test.setTimeout(600_000);

        const pair = buildSaleRefundPair();

        await runTestPoints(loggedInPage, [
            new OpenSecondaryMatchingRulesPage(),
            new OpenSecondaryMatchingSettingsPage(),
            new AssertSaleRefundThresholds(pair.salesAndRefundsThresholds),
            new OpenSecondaryMatchingPage(),
            new UploadSaleRefundPair(pair),
            new WaitForFileInjection(),
            new OpenFileDashboardPage(),
            new FileDashboardFilterUploadedFile(pair.fileName),
            new FileDashboardUIFilterClickSearch(),
            new CheckIfFileIngested(pair.fileName),
            new FileDashboardAssertIngestionStatus("Accepted"),
            new DbShiftSaleRefundCreatedDates(pair.paymentId, 60),
            new OpenSaleAuditTrackPage(),
            // new SaleAuditTrackAssertSaleRefundData(pair.documentNumber, pair.paymentId, pair.ccBin, pair.ccFourLastDigits, pair.fopCode),
            new OpenSecondaryMatchingSettingsPage(),
            new SecondaryMatchingClickTriggerNow(),
            new OpenSecondaryMatchingPage(),
            new SecondaryMatchingAssertDocumentReference(pair.documentNumber, pair.paymentId),
        ]);
    });
});
