// TestPoints used by the scenario specs (accounting). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { AccountingJournalPage } from "../pages/accountingJournal.page";
import { AccountingRulesPage } from "../pages/accountingRules.page";
import { AccountingSettingsPage } from "../pages/accountingSettings.page";
import {
  assertAnyStatus,
  assertColumn,
  assertLastExportMatchesGrid,
  assertTableOmits,
  clearFilters,
  confirmYes,
  downloadExport,
  exportButton,
} from "../pages/scenarioSupport";
import { UnaccountedEventsPage } from "../pages/unaccountedEvents.page";
import { setRulePriority } from "./helpers";

export class AccountingJournalFilterPaymentDate extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-101", `Filter accounting journal by ${date}`, async (page) => {
      const pom = new AccountingJournalPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class AccountingJournalClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-102", "Click Search on the accounting journal", async (page) => {
      await new AccountingJournalPage(page).search.click();
    });
  }
}

export class AccountingJournalAssertEntry extends TestPoint {
  constructor(expected: string) {
    super("TP-NEW-103", `Assert journal entry ${expected}`, async (page) => {
      await assertAnyStatus(new AccountingJournalPage(page), expected);
    });
  }
}

export class AccountingJournalAssertNoEntry extends TestPoint {
  constructor(eventText: string) {
    super("TP-NEW-104", `Assert no journal entry for ${eventText}`, async (page) => {
      await assertTableOmits(new AccountingJournalPage(page), eventText, "Journal");
    });
  }
}

export class AccountingJournalApplyCombinedFilters extends TestPoint {
  constructor(channelType: string) {
    super("TP-NEW-105", `Apply accounting journal channel ${channelType}`, async (page) => {
      const pom = new AccountingJournalPage(page);
      await pom.selectDropdownOption(pom.selectAChannelType, channelType);
    });
  }
}

export class AccountingJournalClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-106", "Clear accounting journal filters", async (page) => {
      await clearFilters(new AccountingJournalPage(page));
    });
  }
}

export class AccountingJournalClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-107", "Export the accounting journal", async (page) => {
      const pom = new AccountingJournalPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class AccountingJournalAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-108", "Assert the journal export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new AccountingJournalPage(page));
    });
  }
}

export class UnaccountedEventsFilterEvent extends TestPoint {
  constructor(date: string, eventName: string, reason: string) {
    super("TP-NEW-109", `Filter unaccounted events ${eventName}`, async (page) => {
      const pom = new UnaccountedEventsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
      await pom.selectDropdownOption(pom.selectEvents, eventName);
      await pom.selectDropdownOption(pom.selectFailureReason, reason);
    });
  }
}

export class UnaccountedEventsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-110", "Click Search on unaccounted events", async (page) => {
      await new UnaccountedEventsPage(page).search.click();
    });
  }
}

export class UnaccountedEventsAssertReason extends TestPoint {
  constructor(reason: string) {
    super("TP-NEW-111", `Assert unaccounted reason ${reason}`, async (page) => {
      await new UnaccountedEventsPage(page).expectTableContains(reason);
    });
  }
}

export class UnaccountedEventsAssertAbsent extends TestPoint {
  constructor(eventText: string) {
    super("TP-NEW-112", `Assert unaccounted event is gone (${eventText})`, async (page) => {
      await assertTableOmits(new UnaccountedEventsPage(page), eventText, "Unaccounted events");
    });
  }
}

export class AccountingRulesSetActive extends TestPoint {
  constructor(ruleName: string, active: boolean) {
    super("TP-NEW-113", `${active ? "Activate" : "Deactivate"} rule ${ruleName}`, async (page) => {
      const pom = new AccountingRulesPage(page);
      const row = pom.page.getByRole("row").filter({ hasText: ruleName }).first();
      await expect(row).toBeVisible();
      const toggle = row.getByRole("switch").or(row.getByRole("checkbox")).first();
      const checked = await toggle.isChecked().catch(() => false);
      if (checked !== active) {
        await toggle.click();
      }
    });
  }
}

export class AccountingRulesSetSamePriority extends TestPoint {
  constructor(ruleA: string, ruleB: string, priority = "1") {
    super("TP-NEW-114", `Set ${ruleA} and ${ruleB} to priority ${priority}`, async (page) => {
      await new AccountingRulesPage(page).expectOnPage();
      await setRulePriority(page, ruleA, priority);
      await setRulePriority(page, ruleB, priority);
    });
  }
}

export class AccountingRulesSetImbalance extends TestPoint {
  constructor(ruleName: string, debitPercent: string, creditPercent: string) {
    super("TP-NEW-115", `Set ${ruleName} debit ${debitPercent} credit ${creditPercent}`, async (page) => {
      const pom = new AccountingRulesPage(page);
      const row = pom.page.getByRole("row").filter({ hasText: ruleName }).first();
      await row
        .getByRole("button")
        .filter({ has: pom.page.locator(".pi-pencil") })
        .first()
        .click();
      const debit = pom.page.getByLabel(/debit/i).or(pom.page.getByPlaceholder(/debit/i)).first();
      const credit = pom.page
        .getByLabel(/credit/i)
        .or(pom.page.getByPlaceholder(/credit/i))
        .first();
      await debit.fill(debitPercent);
      await credit.fill(creditPercent);
      await pom.page.getByRole("button", { name: /save/i }).first().click();
    });
  }
}

export class AccountingSettingsReplayUnaccounted extends TestPoint {
  constructor() {
    super("TP-NEW-116", "Replay unaccounted events", async (page) => {
      const pom = new AccountingSettingsPage(page);
      await pom.replay.click();
      await confirmYes(pom);
    });
  }
}

export class AccountingPeriodAssertPostingDate extends TestPoint {
  constructor(expectedDate: string) {
    super("TP-NEW-123", `Assert posting date ${expectedDate}`, async (page) => {
      await assertColumn(new AccountingJournalPage(page), /posting|accounting date|gl date/i, expectedDate);
    });
  }
}
