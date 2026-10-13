import { expect, Locator } from "@playwright/test";
import { test } from "../../src/fixtures/auth";
import { SaleAuditTrackPage } from "../../src/pages/saleAuditTrack.page";
import { SettlementAuditTrackPage } from "../../src/pages/settlementAuditTrack.page";
import { PaymentOrderAuditTrackPage } from "../../src/pages/paymentOrderAuditTrack.page";
import { BankAuditTrackPage } from "../../src/pages/bankAuditTrack.page";
import { ManualMatchingPage } from "../../src/pages/manualMatching.page";
import { FileDashboardPage } from "../../src/pages/fileDashboard.page";
import { DashboardPage } from "../../src/pages/dashboard.page";
import { MatchedItemsPage } from "../../src/pages/matchedItems.page";

async function report(name: string, locator: Locator, requireVisible = true) {
  if (requireVisible) {
    await expect(locator, name).toBeVisible({ timeout: 10_000 });
  }
  const count = await locator.count();
  console.log(`${name}: count=${count}`);
  expect.soft(count, `${name} should resolve to one element`).toBe(1);
}

test.describe("locator probe", () => {
  test("sale audit track locators", async ({ loggedInPage }) => {
    const pom = new SaleAuditTrackPage(loggedInPage);
    await pom.goto();
    await report("search", pom.search);
    await report("dateRange", pom.dateRange);
    await report("selectAChannelType", pom.selectAChannelType);
    await report("extraFiltersButton", pom.extraFiltersButton);
    await report("salesTab", pom.salesTab);
    await report("saleIdRadio", pom.saleIdRadio);
    await report("documentNumberRadio", pom.documentNumberRadio);
    await report("pnrRadio", pom.pnrRadio);
    await report("paymentIdRadio", pom.paymentIdRadio);
    await report("creditCardRadio", pom.creditCardRadio);
    await report("approvalCodeRadio", pom.approvalCodeRadio);
    await report("quickSearchInput", pom.quickSearchInput);
    await report("quickSearchButton", pom.quickSearchButton);
    await report("paymentDateInput", pom.paymentDateInput);
    await report("countryInput", pom.countryInput);
    await report("fileIdInput", pom.fileIdInput);
    await pom.extraFiltersButton.click();
    await report("fopCode", pom.fopCode);
    await report("fopSubCode", pom.fopSubCode);
    await report("settledStatus", pom.settledStatus);
    await pom.creditCardRadio.click();
    await report("quickSearchInput after card", pom.quickSearchInput);
    await report("quickSearchLast4Input", pom.quickSearchLast4Input);
  });

  test("settlement audit track locators", async ({ loggedInPage }) => {
    const pom = new SettlementAuditTrackPage(loggedInPage);
    await pom.goto();
    await report("settlementTab", pom.settlementTab);
    await report("paymentOrderTab", pom.paymentOrderTab);
    await report("search", pom.search);
    await report("selectCustomerAcquirer", pom.selectCustomerAcquirer);
    await report("extraFiltersButton", pom.extraFiltersButton);
    await report("settlementsTab", pom.settlementsTab);
    await report("settlementIdRadio", pom.settlementIdRadio);
    await report("quickSearchInput", pom.quickSearchInput);
    await report("paymentDateInput", pom.paymentDateInput);
    await pom.extraFiltersButton.click();
    await report("fopCode", pom.fopCode);
    await report("fopSubCode", pom.fopSubCode);
    await report("paymentOrderReference", pom.paymentOrderReference);
    await report("settledStatus", pom.settledStatus);
  });

  test("payment order audit track locators", async ({ loggedInPage }) => {
    const pom = new PaymentOrderAuditTrackPage(loggedInPage);
    await pom.goto();
    await report("host", pom.host);
    await report("search", pom.search);
    await report("extraFiltersButton", pom.extraFiltersButton);
    await report("quickSearchInput", pom.quickSearchInput);
    await report("paymentDateInput", pom.paymentDateInput);
    await report("selectCustomerAcquirer", pom.selectCustomerAcquirer);
    await report("paymentOrderReference", pom.paymentOrderReference);
    await report("bankDepositReference", pom.bankDepositReference);
    await pom.extraFiltersButton.click();
    await report("fileIdInput", pom.fileIdInput);
    await report("bankedStatus", pom.bankedStatus);
  });

  test("bank deposit audit track locators", async ({ loggedInPage }) => {
    const pom = new BankAuditTrackPage(loggedInPage);
    await pom.goto();
    await report("host", pom.host);
    await report("search", pom.search);
    await report("dateRange", pom.dateRange);
    await report("extraFiltersButton", pom.extraFiltersButton);
    await report("quickSearchInput", pom.quickSearchInput);
    await report("paymentDateInput", pom.paymentDateInput);
    await report("selectCustomerAcquirer", pom.selectCustomerAcquirer);
    await report("bankDepositReference", pom.bankDepositReference);
    await report("bankAccountNumber", pom.bankAccountNumber);
    await pom.extraFiltersButton.click();
    await report("fileIdInput", pom.fileIdInput);
    await report("bankedStatus", pom.bankedStatus);
  });

  test("manual matching locators", async ({ loggedInPage }) => {
    const pom = new ManualMatchingPage(loggedInPage);
    await pom.goto();
    await report("settlementReconciliation", pom.settlementReconciliation);
    await report("paymentCurrencyTab", pom.paymentCurrencyTab);
    await report("confirm", pom.confirm);
    await report("resetAll", pom.resetAll);
    await report("search", pom.search);
    await report("selectAChannelType", pom.selectAChannelType);
    await report("extraFiltersButton", pom.extraFiltersButton);
    await report("searchAdvanced", pom.searchAdvanced);
    await report("selectCustomerAcquirer", pom.selectCustomerAcquirer);
    await report("salePnrRadio", pom.salePnrRadio);
    await report("salePnrInput", pom.salePnrInput);
    await report("settlementPnrRadio", pom.settlementPnrRadio);
    await report("settlementPnrInput", pom.settlementPnrInput);
  });

  test("file dashboard / dashboard / matched items locators", async ({ loggedInPage }) => {
    const files = new FileDashboardPage(loggedInPage);
    await files.goto();
    await report("dateRange", files.dateRange);
    await report("extraFiltersButton", files.extraFiltersButton);
    await report("search", files.search);
    await report("exportButton", files.exportButton);
    await report("copy", files.copy);
    await report("loadMore", files.loadMore);
    await report("paginatorFirst", files.paginatorFirst);
    await report("paginatorPage1", files.paginatorPage1);
    await report("dateRangeInput", files.dateRangeInput);

    const dashboard = new DashboardPage(loggedInPage);
    await dashboard.goto();
    await report("dashboard dateRange", dashboard.dateRange);
    await report("download", dashboard.download);
    await report("dateRangeInput", dashboard.dateRangeInput);

    const matched = new MatchedItemsPage(loggedInPage);
    await matched.goto();
    await report("settlementReconciliation", matched.settlementReconciliation);
    await report("dateRange", matched.dateRange);
    await report("selectMatchingStatus", matched.selectMatchingStatus);
    await report("selectReconciliationStatus", matched.selectReconciliationStatus);
    await report("search", matched.search);
  });
});
