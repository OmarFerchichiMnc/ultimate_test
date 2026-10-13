import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenSettlementAuditTrackPage, SettlementAuditTrackOpenTab, SettlementUIFilterSettlementID, SettlementUIClickSearchQuickFilter, SettlementUICheckIfSettlementTableNotEmpty, SettlementUIClearQuickFilter, SettlementUIFilterDocumentNumber, SettlementUIFilterPNROrderReference, SettlementUIFilterPaymentID, SettlementUIFilterCreditCardBIN, SettlementUIFilterCreditCard4LastDegits, SettlementUIFilterApprovalCode, SettlementUIFilterPaymentDateRange, SettlementUIFilterCustomerAcquirer, SettlementUIFilterCountry, SettlementUIFilterFileID, SettlementUIAddFilters, SettlementUIFilterFOPCode, SettlementUIFilterFOPSubCode, SettlementUIFilterPaymentOrderReference, SettlementUIFilterSettledStatus, SettlementUIClickSearch, SettlementAuditTrackClickExport, SettlementAuditTrackAssertExportContent } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-40 Audit track filters: refunded settlements", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenSettlementAuditTrackPage(),
      new SettlementAuditTrackOpenTab("Refunded Settlements"),
      new SettlementUIFilterSettlementID("1"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementUIClearQuickFilter(),
      new SettlementUIFilterDocumentNumber("2129690954587"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementUIClearQuickFilter(),
      new SettlementUIFilterPNROrderReference("Q8E3G2"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementUIClearQuickFilter(),
      new SettlementUIFilterPaymentID("1"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementUIClearQuickFilter(),
      new SettlementUIFilterCreditCardBIN("827919"),
      new SettlementUIFilterCreditCard4LastDegits("6395"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementUIClearQuickFilter(),
      new SettlementUIFilterApprovalCode("148256"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementUIClearQuickFilter(),
      new SettlementUIFilterPaymentDateRange("01/01/2026 - 31/01/2026"),
      new SettlementUIFilterCustomerAcquirer("adyen"),
      new SettlementUIFilterCountry("TU"),
      new SettlementUIFilterFileID(),
      new SettlementUIAddFilters(),
      new SettlementUIFilterFOPCode("CCVI"),
      new SettlementUIFilterFOPSubCode("EXTASO"),
      new SettlementUIFilterPaymentOrderReference("Q8E3G2"),
      new SettlementUIFilterSettledStatus("Settled"),
      new SettlementUIClickSearch(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementAuditTrackClickExport(),
      new SettlementAuditTrackAssertExportContent(),
    ]);
  });
});
