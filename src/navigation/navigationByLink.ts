import { Page, expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { logger } from "../configuration/logger";
import { pathMatches } from "../pages/BasePage";

type Route = {
  id: string;
  path: string;
  description: string;
  ticketId?: string;
  assertPath?: string;
};

function navigateByLink({ id, path, description, ticketId = "*****", assertPath }: Route): new () => TestPoint {
  return class NavigateByLink extends TestPoint {
    constructor() {
      super(
        id,
        description,
        async (page: Page) => {
          await page.goto(path, { waitUntil: "domcontentloaded" });
          await expect(page).toHaveURL((url) =>
            assertPath ? url.pathname.includes(assertPath) : pathMatches(url, path),
          );
          await page.locator("adad-frontend-layout, app-root").first().waitFor({ state: "visible" });
          logger.info(`Navigated to ${assertPath ?? path}`);
        },
        ticketId,
      );
    }
  };
}

export const TestPointNavigateDashboardByLink = navigateByLink({
  id: "TP000",
  path: "/dashboard",
  description: "Navigate to Dashboard page",
  ticketId: "ADAD-0000",
});

export const TestPointNavigateToCashForecastByLink = navigateByLink({
  id: "TP001",
  path: "/dashboard/cash-forecast",
  description: "Navigate to cash forecast page",
  ticketId: "ADAD-0001",
  assertPath: "/cash-forecast",
});

export const TestPointNavigateToAlertManagementByLink = navigateByLink({
  id: "TP0002",
  path: "/alerts",
  description: "Navigate to Alert management page",
});

export const TestPointNavigateToReconciliationAlertsByLink = navigateByLink({
  id: "TP0003",
  path: "/reconciliation-alerts",
  description: "Navigate to Reconciliation Alert page",
});

export const TestPointNavigateToFileDashboardByLink = navigateByLink({
  id: "TP0004",
  path: "/etl-files",
  description: "Navigate to File Dashboard page",
});

export const TestPointNavigateToFailedTransactionsByLink = navigateByLink({
  id: "TP0005",
  path: "/failed-transactions",
  description: "Navigate to Failed Transactions page",
});

export const TestPointNavigateToAuditTrackSaleByLink = navigateByLink({
  id: "TP0006",
  path: "/audit-track/sale",
  description: "Navigate to audit track sale page",
});

export const TestPointNavigateToAuditTrackSettlementByLink = navigateByLink({
  id: "TP0007",
  path: "/audit-track/settlement",
  description: "Navigate to audit track settlement page",
});

export const TestPointNavigateToPendingItemsByLink = navigateByLink({
  id: "TP0008",
  path: "/pending-items",
  description: "Navigate to pending items page",
});

export const TestPointNavigateToProvisionalMismatchedItemsByLink = navigateByLink({
  id: "TP0009",
  path: "/provisional-mismatched-items",
  description: "Navigate to Provisional Mismatched Items page",
});

export const TestPointNavigateToInstallmentsByLink = navigateByLink({
  id: "TP0010",
  path: "/installments",
  description: "Navigate to installments page",
});

export const TestPointNavigateToMatchedItemsMatchedByLink = navigateByLink({
  id: "TP0011",
  path: "/matched-items",
  description: "Navigate to Matched page",
});

export const TestPointNavigateToExceptionsByLink = navigateByLink({
  id: "TP0012",
  path: "/matched-items/exceptions",
  description: "Navigate to Exceptions page",
});

export const TestPointNavigateToManualMatchingByLink = navigateByLink({
  id: "TP0013",
  path: "/manual-matching",
  description: "Navigate to Manual Matching page",
});

export const TestPointNavigateSettlementsDisputesByLink = navigateByLink({
  id: "TP0014",
  path: "/settlement-disputes",
  description: "Navigate to settlement disputes page",
  ticketId: "ADAD-0014",
});

export const TestPointNavigateToAccountingJournalByLink = navigateByLink({
  id: "TP0015",
  path: "/accounting-journal",
  description: "Navigate to accounting journal page",
});

export const TestPointNavigateToUnaccountedEventsByLink = navigateByLink({
  id: "TP0016",
  path: "/unaccounted-events",
  description: "Navigate to unaccounted events page",
});

export const TestPointNavigateToImbalancedJournalEntriesByLink = navigateByLink({
  id: "TP0017",
  path: "/imbalanced-items",
  description: "Navigate to Imbalanced Journal Entries page",
});

export const TestPointNavigateToTrialBalanceByLink = navigateByLink({
  id: "TP0018",
  path: "/trial-balance",
  description: "Navigate to trial balance page",
});

export const TestPointNavigateToPostToLedgerByLink = navigateByLink({
  id: "TP0019",
  path: "/post-to-ledger",
  description: "Navigate to post to ledger page",
});

export const TestPointNavigateToBusinesssRulesAlertTypeAffiliationByLink = navigateByLink({
  id: "TP0020",
  path: "/alert-type-affiliation",
  description: "Navigate to Alert Type Affiliation page",
});

export const TestPointNavigateToBusinesssRulesReconciliationMachingRulesSettlementReconciliationByLink =
  navigateByLink({
    id: "TP0022",
    path: "/matching-rules/settlement-reconciliation",
    description: "Navigate to settlement reconciliation matching page",
  });

export const TestPointNavigateToBusinesssRulesReconciliationMachingRulesBankReconciliationByLink = navigateByLink({
  id: "TP0023",
  path: "/matching-rules/bank-reconciliation",
  description: "Navigate to bank reconciliation matching page",
});

export const TestPointNavigateToBusinesssRulesReconciliationSettlementReconciliationSettingsByLink = navigateByLink({
  id: "TP0024",
  path: "/settlement-reconciliation-settings",
  description: "Navigate to settlement reconciliation settings page",
});

export const TestPointNavigateToBusinesssRulesReconciliationBankReconciliationSettingsByLink = navigateByLink({
  id: "TP0025",
  path: "/bank-reconciliation-settings",
  description: "Navigate to bank reconciliation settings page",
});

export const TestPointNavigateToBusinesssRulesAccountingAccountingRulesByLink = navigateByLink({
  id: "TP0026",
  path: "/accounting-rules",
  description: "Navigate to accounting rules page",
});

export const TestPointNavigateToBusinesssRulesAccountingAccountingPeriodsByLink = navigateByLink({
  id: "TP0027",
  path: "/accounting-periods",
  description: "Navigate to accounting periods page",
});

export const TestPointNavigateToBusinesssRulesAccountingChartsOfAccountsByLink = navigateByLink({
  id: "TP0028",
  path: "/chart-accounts",
  description: "Navigate to charts of accounts page",
});

export const TestPointNavigateToBusinesssRulesAccountingSettingsByLink = navigateByLink({
  id: "TP0029",
  path: "/accounting-settings",
  description: "Navigate to accounting settings page",
});

export const TestPointNavigateToBusinesssRulesGeneralSettingsByLink = navigateByLink({
  id: "TP0030",
  path: "/general-settings",
  description: "Navigate to general settings page",
});

export const TestPointNavigateToBusinesssRulesMerchantFeeRulesByLink = navigateByLink({
  id: "TP0031",
  path: "/fee-rules",
  description: "Navigate to merchant fee rules page",
});

export const TestPointNavigateToMasterDataRateOfExchangeByLink = navigateByLink({
  id: "TP0032",
  path: "/roe",
  description: "Navigate to rate of exchange page",
});

export const TestPointNavigateToMasterDataFxRateSourcesByLink = navigateByLink({
  id: "TP0033",
  path: "/fx-rate-sources",
  description: "Navigate to fx rate source page",
});

export const TestPointNavigateToMasterDataFormOfPaymentsByLink = navigateByLink({
  id: "TP0034",
  path: "/form-of-payments",
  description: "Navigate to form of payments page",
});

export const TestPointNavigateToMasterDataPointOfSalesByLink = navigateByLink({
  id: "TP0035",
  path: "/point-of-sales",
  description: "Navigate to point of sales page",
});

export const TestPointNavigateToMasterDataPointOfSalesMerchantMappingByLink = navigateByLink({
  id: "TP0036",
  path: "/point-of-sales-merchant-mapping",
  description: "Navigate to point of sales merchant mapping page",
});

export const TestPointNavigateToMasterDataAcquirersByLink = navigateByLink({
  id: "TP0037",
  path: "/acquirers",
  description: "Navigate to acquirers page",
});

export const TestPointNavigateToMasterDataAcquirersMerchantsByLink = navigateByLink({
  id: "TP0038",
  path: "/acquirer-merchants",
  description: "Navigate to acquirers merchants page",
});

export const TestPointNavigateToMasterDataSaleSourcesByLink = navigateByLink({
  id: "TP0039",
  path: "/sale-sources",
  description: "Navigate to sale sources page",
});

export const TestPointNavigateToAuditTrackBankByLink = navigateByLink({
  id: "TP0040",
  path: "/audit-track/bank",
  description: "Navigate to audit track bank page",
});

export const TestPointNavigateToSecondaryMatchingByLink = navigateByLink({
  id: "TP0041",
  path: "/secondary-matching",
  description: "Navigate to secondary matching page",
});

export const TestPointNavigateToGlDetailsByLink = navigateByLink({
  id: "TP0042",
  path: "/gl-details",
  description: "Navigate to GL details page",
});

export const TestPointNavigateToFileSettingsByLink = navigateByLink({
  id: "TP0043",
  path: "/settings/file",
  description: "Navigate to file settings page",
});

export const TestPointNavigateToTransactionSettingsByLink = navigateByLink({
  id: "TP0044",
  path: "/settings/transaction",
  description: "Navigate to transaction settings page",
});

export const TestPointNavigateToSecondaryMatchingRulesByLink = navigateByLink({
  id: "TP0045",
  path: "/matching-rules/secondary-matching",
  description: "Navigate to secondary matching rules page",
});

export const TestPointNavigateToSecondaryMatchingSettingsByLink = navigateByLink({
  id: "TP0046",
  path: "/secondary-matching-settings",
  description: "Navigate to secondary matching settings page",
});

export const TestPointNavigateToReportsByLink = navigateByLink({
  id: "TP0047",
  path: "/reports",
  description: "Navigate to reports page",
});

export const navigationByLinkTestPoints = [
  TestPointNavigateDashboardByLink,
  TestPointNavigateToCashForecastByLink,
  TestPointNavigateToAlertManagementByLink,
  TestPointNavigateToReconciliationAlertsByLink,
  TestPointNavigateToFileDashboardByLink,
  TestPointNavigateToFailedTransactionsByLink,
  TestPointNavigateToAuditTrackSaleByLink,
  TestPointNavigateToAuditTrackSettlementByLink,
  TestPointNavigateToPendingItemsByLink,
  TestPointNavigateToProvisionalMismatchedItemsByLink,
  TestPointNavigateToInstallmentsByLink,
  TestPointNavigateToMatchedItemsMatchedByLink,
  TestPointNavigateToExceptionsByLink,
  TestPointNavigateToManualMatchingByLink,
  TestPointNavigateSettlementsDisputesByLink,
  TestPointNavigateToAccountingJournalByLink,
  TestPointNavigateToUnaccountedEventsByLink,
  TestPointNavigateToImbalancedJournalEntriesByLink,
  TestPointNavigateToTrialBalanceByLink,
  TestPointNavigateToPostToLedgerByLink,
  TestPointNavigateToBusinesssRulesAlertTypeAffiliationByLink,
  TestPointNavigateToBusinesssRulesReconciliationMachingRulesSettlementReconciliationByLink,
  TestPointNavigateToBusinesssRulesReconciliationMachingRulesBankReconciliationByLink,
  TestPointNavigateToBusinesssRulesReconciliationSettlementReconciliationSettingsByLink,
  TestPointNavigateToBusinesssRulesReconciliationBankReconciliationSettingsByLink,
  TestPointNavigateToBusinesssRulesAccountingAccountingRulesByLink,
  TestPointNavigateToBusinesssRulesAccountingAccountingPeriodsByLink,
  TestPointNavigateToBusinesssRulesAccountingChartsOfAccountsByLink,
  TestPointNavigateToBusinesssRulesAccountingSettingsByLink,
  TestPointNavigateToBusinesssRulesGeneralSettingsByLink,
  TestPointNavigateToBusinesssRulesMerchantFeeRulesByLink,
  TestPointNavigateToMasterDataRateOfExchangeByLink,
  TestPointNavigateToMasterDataFxRateSourcesByLink,
  TestPointNavigateToMasterDataFormOfPaymentsByLink,
  TestPointNavigateToMasterDataPointOfSalesByLink,
  TestPointNavigateToMasterDataPointOfSalesMerchantMappingByLink,
  TestPointNavigateToMasterDataAcquirersByLink,
  TestPointNavigateToMasterDataAcquirersMerchantsByLink,
  TestPointNavigateToMasterDataSaleSourcesByLink,
  TestPointNavigateToAuditTrackBankByLink,
  TestPointNavigateToSecondaryMatchingByLink,
  TestPointNavigateToGlDetailsByLink,
  TestPointNavigateToFileSettingsByLink,
  TestPointNavigateToTransactionSettingsByLink,
  TestPointNavigateToSecondaryMatchingRulesByLink,
  TestPointNavigateToSecondaryMatchingSettingsByLink,
  TestPointNavigateToReportsByLink,
];
