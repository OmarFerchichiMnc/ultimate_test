import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenManualMatchingPage, ManualMatchingSelectMode, ManualMatchingFilterDateRange, ManualMatchingUIFilterSelectPNROrderREferenceToFilter, ManualMatchingSaleUIFilterPNROrderReference, ManualMatchingUISaleClickSearchQuickFilters, ManualMatchingUISettlementFilterSelectPNROrderReferenceToFilter, ManualMatchingSettlementUIFilterPNROrderReference, ManualMatchingUISettlmeentClickSearchQuickFilters, ManualMatchingUISaleClickCheckBox, ManualMatchingUISettlementClickCheckBox, ManualMatchingUIConfirmMatching, ManualMatchingUIMatchSaleAndSettlement, ManualMatchingUIMatchSaleAndSettlementClickYes, ManualMatchingAssertMatchResult, OpenSaleAuditTrackPage, SaleUIFilterDocumentNumber, SaleUIClickSearchQuickFilter, SaleUICheckIfSaleTableNotEmpty, SaleAuditTrackAssertLifecycleEvents, OpenSettlementAuditTrackPage, SettlementUIFilterDocumentNumber, SettlementUIClickSearchQuickFilter, SettlementUICheckIfSettlementTableNotEmpty, SettlementAuditTrackAssertLifecycleEvents } from "../../src/pages";

test.describe("Matching & Reconciliation", () => {
  test("MR-09 Manual matching, settlement reconciliation", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenManualMatchingPage(),
      new ManualMatchingSelectMode("Settlement Reconciliation"),
      new ManualMatchingFilterDateRange("01/01/2026 - 31/01/2026"),
      new ManualMatchingUIFilterSelectPNROrderREferenceToFilter(),
      new ManualMatchingSaleUIFilterPNROrderReference("Q8E3G2"),
      new ManualMatchingUISaleClickSearchQuickFilters(),
      new ManualMatchingUISettlementFilterSelectPNROrderReferenceToFilter(),
      new ManualMatchingSettlementUIFilterPNROrderReference("Q8E3G2"),
      new ManualMatchingUISettlmeentClickSearchQuickFilters(),
      new ManualMatchingUISaleClickCheckBox(),
      new ManualMatchingUISettlementClickCheckBox(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlement(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new ManualMatchingAssertMatchResult("Accepted", "Accepted"),
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterDocumentNumber("2129690954587"),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
      new SaleAuditTrackAssertLifecycleEvents([]),
      new OpenSettlementAuditTrackPage(),
      new SettlementUIFilterDocumentNumber("2129690954587"),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
      new SettlementAuditTrackAssertLifecycleEvents([]),
    ]);
  });
});
