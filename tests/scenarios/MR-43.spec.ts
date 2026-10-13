import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPaymentOrderAuditTrackPage, PaymentOrderAuditTrackOpenDeleted, PaymentOrderUIFilterPaymentOrderID, PaymentOrderUIClickSearchQuickFilter, PaymentOrderUICheckIfTableNotEmpty, PaymentOrderUIClearQuickFilter, PaymentOrderUIFilterPaymentOrderReference, PaymentOrderUIFilterBankDepositReference, PaymentOrderUIFilterPaymentOrderDateRange, PaymentOrderUIFilterCustomerAcquirer, PaymentOrderUIAddFilters, PaymentOrderUIFilterBankedStatus, PaymentOrderUIFilterFileID, PaymentOrderUIClickSearch, PaymentOrderAuditTrackClickExport, PaymentOrderAuditTrackAssertExportContent } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-43 Audit track filters: deleted payment orders", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPaymentOrderAuditTrackPage(),
      new PaymentOrderAuditTrackOpenDeleted(),
      new PaymentOrderUIFilterPaymentOrderID("1"),
      new PaymentOrderUIClickSearchQuickFilter(),
      new PaymentOrderUICheckIfTableNotEmpty(),
      new PaymentOrderUIClearQuickFilter(),
      new PaymentOrderUIFilterPaymentOrderReference("Q8E3G2"),
      new PaymentOrderUIClickSearchQuickFilter(),
      new PaymentOrderUICheckIfTableNotEmpty(),
      new PaymentOrderUIClearQuickFilter(),
      new PaymentOrderUIFilterBankDepositReference("Q8E3G2"),
      new PaymentOrderUIClickSearchQuickFilter(),
      new PaymentOrderUICheckIfTableNotEmpty(),
      new PaymentOrderUIFilterPaymentOrderDateRange("01/01/2026 - 31/01/2026"),
      new PaymentOrderUIFilterCustomerAcquirer("adyen"),
      new PaymentOrderUIAddFilters(),
      new PaymentOrderUIFilterBankedStatus("Deleted"),
      new PaymentOrderUIFilterFileID(),
      new PaymentOrderUIClickSearch(),
      new PaymentOrderUICheckIfTableNotEmpty(),
      new PaymentOrderAuditTrackClickExport(),
      new PaymentOrderAuditTrackAssertExportContent(),
    ]);
  });
});
