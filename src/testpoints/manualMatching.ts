// TestPoints used by the scenario specs (manualMatching). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { TestPoint } from "../testpoint/TestPoint";
import { ManualMatchingPage } from "../pages/manualMatching.page";
import { assertText } from "../pages/scenarioSupport";
import { selectTwoPanes } from "./helpers";

export class ManualMatchingSelectMode extends TestPoint {
  constructor(mode: string) {
    super("TP-NEW-069", `Select manual matching mode ${mode}`, async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.selectDropdownOption(pom.settlementReconciliation, mode);
    });
  }
}

export class ManualMatchingFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-070", `Filter manual matching by ${date}`, async (page) => {
      const pom = new ManualMatchingPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class ManualMatchingSelectBankPair extends TestPoint {
  constructor() {
    super("TP-NEW-071", "Select a payment order and a bank deposit", async (page) => {
      await selectTwoPanes(new ManualMatchingPage(page));
    });
  }
}

export class ManualMatchingSelectSaleRefundPair extends TestPoint {
  constructor() {
    super("TP-NEW-072", "Select a sale and a refund", async (page) => {
      await selectTwoPanes(new ManualMatchingPage(page));
    });
  }
}

export class ManualMatchingSelectSettlementRefundDebitPair extends TestPoint {
  constructor() {
    super("TP-NEW-073", "Select a settlement and a refund debit", async (page) => {
      await selectTwoPanes(new ManualMatchingPage(page));
    });
  }
}

export class ManualMatchingAssertMatchResult extends TestPoint {
  constructor(matchingStatus: string, reconciliationStatus: string) {
    super("TP-NEW-074", `Assert match ${matchingStatus} / ${reconciliationStatus}`, async (page) => {
      const pom = new ManualMatchingPage(page);
      await assertText(pom, matchingStatus);
      await assertText(pom, reconciliationStatus);
    });
  }
}
