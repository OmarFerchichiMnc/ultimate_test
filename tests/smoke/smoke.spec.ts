import { test } from "../../src/fixtures/auth";
import { InjectFile } from "../../src/configuration/fileInjection";
import { config } from "../../src/configuration/config";
import {
  TestPointNavigateToBusinesssRulesReconciliationSettlementReconciliationSettingsByLink,
  TestPointNavigateToFileDashboardByLink,
  TestPointNavigateToManualMatchingByLink,
  TestPointNavigateToMatchedItemsMatchedByLink,
} from "../../src/navigation/navigationByLink";
import { CheckIfFileIngested, FileDashboardUIFilterClickSearch } from "../../src/pages/fileDashboard.page";
import { TriggerNow } from "../../src/pages/settlementReconciliationSettings.page";
import { SaleUICheckIfMatchingDoneCorrectly } from "../../src/pages/matchedItems.page";
import {
  ManualMatchingSaleUIFilterPNROrderReference,
  ManualMatchingSettlementUIFilterPNROrderReference,
  ManualMatchingUIConfirmMatching,
  ManualMatchingUIFilterSelectPNROrderREferenceToFilter,
  ManualMatchingUIMatchSaleAndSettlement,
  ManualMatchingUIMatchSaleAndSettlementClickYes,
  ManualMatchingUISaleClickCheckBox,
  ManualMatchingUISaleClickSearchQuickFilters,
  ManualMatchingUISettlementClickCheckBox,
  ManualMatchingUISettlementFilterSelectPNROrderReferenceToFilter,
  ManualMatchingUISettlmeentClickSearchQuickFilters,
} from "../../src/pages/manualMatching.page";
import { TestPoint } from "../../src/testpoint/TestPoint";
import { runTestPoints } from "../runTestPoints";

function ingested(localPath: string, remoteDir: string, fileName: string): TestPoint[] {
  return [
    new InjectFile(localPath, remoteDir, fileName),
    new TestPointNavigateToFileDashboardByLink(),
    new FileDashboardUIFilterClickSearch(),
    new CheckIfFileIngested(fileName),
  ];
}

function ingestedSaleAndSettlement(): TestPoint[] {
  return [
    ...ingested(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
    ...ingested(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
  ];
}

test.describe("smoke tests", () => {
  test("upload sales files", async ({ loggedInPage }) => {
    await runTestPoints(
      loggedInPage,
      ingested(config.files.salePath, config.adadPaths.sales, config.files.saleFileName),
    );
  });

  test("upload settlement files", async ({ loggedInPage }) => {
    await runTestPoints(
      loggedInPage,
      ingested(config.files.settlementPath, config.adadPaths.settlement, config.files.settlementFileName),
    );
  });

  test("verify the basic matching", async ({ loggedInPage }) => {
    await runTestPoints(loggedInPage, [
      ...ingestedSaleAndSettlement(),
      new TestPointNavigateToBusinesssRulesReconciliationSettlementReconciliationSettingsByLink(),
      new TriggerNow(),
    ]);
  });

  test("trigger the advanced matching", async ({ loggedInPage }) => {
    await runTestPoints(loggedInPage, [
      ...ingestedSaleAndSettlement(),
      new TestPointNavigateToBusinesssRulesReconciliationSettlementReconciliationSettingsByLink(),
      new TriggerNow(),
      new TestPointNavigateToMatchedItemsMatchedByLink(),
      new SaleUICheckIfMatchingDoneCorrectly("1"),
    ]);
  });

  test("verify the manual matching", async ({ loggedInPage }) => {
    await runTestPoints(loggedInPage, [
      ...ingestedSaleAndSettlement(),
      new TestPointNavigateToManualMatchingByLink(),
      new ManualMatchingUIFilterSelectPNROrderREferenceToFilter(),
      new ManualMatchingSaleUIFilterPNROrderReference("R4Y7W4"),
      new ManualMatchingUISaleClickSearchQuickFilters(),
      new ManualMatchingUISaleClickCheckBox(),
      new ManualMatchingUISettlementFilterSelectPNROrderReferenceToFilter(),
      new ManualMatchingSettlementUIFilterPNROrderReference("R4Y7W4"),
      new ManualMatchingUISettlmeentClickSearchQuickFilters(),
      new ManualMatchingUISettlementClickCheckBox(),
      new ManualMatchingUIConfirmMatching(),
      new ManualMatchingUIMatchSaleAndSettlement(),
      new ManualMatchingUIMatchSaleAndSettlementClickYes(),
      new TestPointNavigateToMatchedItemsMatchedByLink(),
      new SaleUICheckIfMatchingDoneCorrectly("1"),
    ]);
  });
});
