import { TestPoint } from "../testpoint/TestPoint";
import { DashboardPage } from "./dashboard.page";
import { CashForecastPage } from "./cashForecast.page";
import { AlertsPage } from "./alerts.page";
import { ReconciliationAlertsPage } from "./reconciliationAlerts.page";
import { FileDashboardPage } from "./fileDashboard.page";
import { FailedTransactionsPage } from "./failedTransactions.page";
import { SaleAuditTrackPage } from "./saleAuditTrack.page";
import { SettlementAuditTrackPage } from "./settlementAuditTrack.page";
import { PendingItemsPage } from "./pendingItems.page";
import { ProvisionalMismatchedItemsPage } from "./provisionalMismatchedItems.page";
import { InstallmentsPage } from "./installments.page";
import { MatchedItemsPage } from "./matchedItems.page";
import { MatchedItemsExceptionsPage } from "./matchedItemsExceptions.page";
import { ManualMatchingPage } from "./manualMatching.page";
import { SettlementDisputesPage } from "./settlementDisputes.page";
import { AccountingJournalPage } from "./accountingJournal.page";
import { UnaccountedEventsPage } from "./unaccountedEvents.page";
import { ImbalancedItemsPage } from "./imbalancedItems.page";
import { TrialBalancePage } from "./trialBalance.page";
import { PostToLedgerPage } from "./postToLedger.page";
import { AlertTypeAffiliationPage } from "./alertTypeAffiliation.page";
import { FileSettingsPage } from "./fileSettings.page";
import { SettlementReconciliationRulesPage } from "./settlementReconciliationRules.page";
import { BankReconciliationRulesPage } from "./bankReconciliationRules.page";
import { SettlementReconciliationSettingsPage } from "./settlementReconciliationSettings.page";
import { BankReconciliationSettingsPage } from "./bankReconciliationSettings.page";
import { AccountingRulesPage } from "./accountingRules.page";
import { AccountingPeriodsPage } from "./accountingPeriods.page";
import { ChartAccountsPage } from "./chartAccounts.page";
import { AccountingSettingsPage } from "./accountingSettings.page";
import { GeneralSettingsPage } from "./generalSettings.page";
import { FeeRulesPage } from "./feeRules.page";
import { RoePage } from "./roe.page";
import { FxRateSourcesPage } from "./fxRateSources.page";
import { FormOfPaymentsPage } from "./formOfPayments.page";
import { PointOfSalesPage } from "./pointOfSales.page";
import { PointOfSalesMerchantMappingPage } from "./pointOfSalesMerchantMapping.page";
import { AcquirersPage } from "./acquirers.page";
import { AcquirerMerchantsPage } from "./acquirerMerchants.page";
import { SaleSourcesPage } from "./saleSources.page";
import { BankAuditTrackPage } from "./bankAuditTrack.page";
import { SecondaryMatchingPage } from "./secondaryMatching.page";
import { GlDetailsPage } from "./glDetails.page";
import { TransactionSettingsPage } from "./transactionSettings.page";
import { SecondaryMatchingRulesPage } from "./secondaryMatchingRules.page";
import { SecondaryMatchingSettingsPage } from "./secondaryMatchingSettings.page";
import { ReportsPage } from "./reports.page";

export type InventoryPage = {
  path: string;
  testPoints: () => TestPoint[];
};

export const PAGE_INVENTORY: InventoryPage[] = [
  DashboardPage,
  CashForecastPage,
  AlertsPage,
  ReconciliationAlertsPage,
  FileDashboardPage,
  FailedTransactionsPage,
  SaleAuditTrackPage,
  SettlementAuditTrackPage,
  PendingItemsPage,
  ProvisionalMismatchedItemsPage,
  InstallmentsPage,
  MatchedItemsPage,
  MatchedItemsExceptionsPage,
  ManualMatchingPage,
  SettlementDisputesPage,
  AccountingJournalPage,
  UnaccountedEventsPage,
  ImbalancedItemsPage,
  TrialBalancePage,
  PostToLedgerPage,
  AlertTypeAffiliationPage,
  FileSettingsPage,
  SettlementReconciliationRulesPage,
  BankReconciliationRulesPage,
  SettlementReconciliationSettingsPage,
  BankReconciliationSettingsPage,
  AccountingRulesPage,
  AccountingPeriodsPage,
  ChartAccountsPage,
  AccountingSettingsPage,
  GeneralSettingsPage,
  FeeRulesPage,
  RoePage,
  FxRateSourcesPage,
  FormOfPaymentsPage,
  PointOfSalesPage,
  PointOfSalesMerchantMappingPage,
  AcquirersPage,
  AcquirerMerchantsPage,
  SaleSourcesPage,
  BankAuditTrackPage,
  SecondaryMatchingPage,
  GlDetailsPage,
  TransactionSettingsPage,
  SecondaryMatchingRulesPage,
  SecondaryMatchingSettingsPage,
  ReportsPage,
];
