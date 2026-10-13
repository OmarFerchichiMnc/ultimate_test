import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenSaleAuditTrackPage, SaleUIFilterPaymentDateRange, SaleAuditTrackOpenTab, SaleUIFilterSaleID, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleUIClearQuickFilter, SaleUIFilterDocumentNumber, SaleUIFilterPNROrderReference, SaleUIFilterPaymentID, SaleUIFilterCreditCardBIN, SaleUIFilterCreditCard4LastDegits, SaleUIFilterApprovalCode, SaleUIFilterChannelType, SaleUIFilterCountry, SaleUIFilterFileID, SaleUIAddFilters, SaleUIFilterFOPCode, SaleUIFilterFOPSubCode, SaleUIFilterSettledStatus, SaleUIClickSearch, SaleAuditTrackClickExport, SaleAuditTrackAssertExportContent } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-37 Audit track filters: refunded sales", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterPaymentDateRange("01/01/2026 - 31/01/2026"),
      new SaleAuditTrackOpenTab("Refunded Sales"),
      new SaleUIFilterSaleID("1"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleUIClearQuickFilter(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleUIClearQuickFilter(),
      new SaleUIFilterPNROrderReference("Q8E3G2"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleUIClearQuickFilter(),
      new SaleUIFilterPaymentID("1"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleUIClearQuickFilter(),
      new SaleUIFilterCreditCardBIN("827919"),
      new SaleUIFilterCreditCard4LastDegits("6395"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleUIClearQuickFilter(),
      new SaleUIFilterApprovalCode("148256"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleUIClearQuickFilter(),
      new SaleUIFilterPaymentDateRange("01/01/2026 - 31/01/2026"),
      new SaleUIFilterChannelType("INDIRECT"),
      new SaleUIFilterCountry("TU"),
      new SaleUIFilterFileID(),
      new SaleUIAddFilters(),
      new SaleUIFilterFOPCode("CCVI"),
      new SaleUIFilterFOPSubCode("EXTASO"),
      new SaleUIFilterSettledStatus("Settled"),
      new SaleUIClickSearch(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackClickExport(),
      new SaleAuditTrackAssertExportContent(),
    ]);
  });
});
