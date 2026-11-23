// TestPoints used by the scenario specs (matchedItems). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { expect } from "@playwright/test";
import { TestPoint } from "../testpoint/TestPoint";
import { BankReconciliationSettingsPage } from "../pages/bankReconciliationSettings.page";
import { MatchedItemsPage } from "../pages/matchedItems.page";
import { PendingItemsPage } from "../pages/pendingItems.page";
import {
  assertAnyStatus,
  assertLastExportMatchesGrid,
  assertText,
  clearFilters,
  clickNamed,
  confirmAction,
  downloadExport,
  exportButton,
} from "../pages/scenarioSupport";
import { SettlementReconciliationRulesPage } from "../pages/settlementReconciliationRules.page";
import { setRulePriority } from "./helpers";

export class BankReconciliationClickTriggerNow extends TestPoint {
  constructor() {
    super("TP-NEW-049", "Click Trigger now on bank reconciliation settings", async (page) => {
      await new BankReconciliationSettingsPage(page).triggerNow.click();
    });
  }
}

export class MatchingRulesSetStackPriority extends TestPoint {
  constructor(highRule: string, lowRule: string) {
    super("TP-NEW-051", `Set ${highRule} above ${lowRule}`, async (page) => {
      await new SettlementReconciliationRulesPage(page).expectOnPage();
      await setRulePriority(page, highRule, "1");
      await setRulePriority(page, lowRule, "2");
    });
  }
}

export class MatchedItemsFilterDateRange extends TestPoint {
  constructor(date: string) {
    super("TP-NEW-052", `Filter matched items by ${date}`, async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.fillCalendarTrigger(pom.dateRange, date);
    });
  }
}

export class MatchedItemsSelectReconciliation extends TestPoint {
  constructor(mode: string) {
    super("TP-NEW-053", `Select reconciliation ${mode}`, async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.selectDropdownOption(pom.settlementReconciliation, mode);
    });
  }
}

export class MatchedItemsClickSearch extends TestPoint {
  constructor() {
    super("TP-NEW-054", "Click Search on Matched Items", async (page) => {
      await new MatchedItemsPage(page).search.click();
    });
  }
}

export class MatchedItemsAssertMoleculeStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-055", `Assert molecule status ${status}`, async (page) => {
      await assertAnyStatus(new MatchedItemsPage(page), status);
    });
  }
}

export class MatchedItemsOpenMolecule extends TestPoint {
  constructor() {
    super("TP-NEW-056", "Open the first molecule", async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.view.first().click();
      await expect(pom.page.locator(".p-dialog, .p-sidebar").last()).toBeVisible();
    });
  }
}

export class MatchedItemsAssertAtomsLinked extends TestPoint {
  constructor(expectedBalance: string) {
    super("TP-NEW-057", `Assert linked atoms and balance ${expectedBalance}`, async (page) => {
      const pom = new MatchedItemsPage(page);
      const detail = pom.page.locator(".p-dialog, .p-sidebar").last();
      await expect(detail).toBeVisible();
      expect(await detail.getByRole("row").count()).toBeGreaterThan(1);
      if (expectedBalance) {
        await assertText(pom, expectedBalance, detail);
      }
    });
  }
}

export class MatchedItemsUnmatch extends TestPoint {
  constructor() {
    super("TP-NEW-058", "Unmatch the molecule", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /unmatch/i);
    });
  }
}

export class MatchedItemsMarkComplete extends TestPoint {
  constructor() {
    super("TP-NEW-059", "Mark the molecule complete", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /mark as complete|complete/i);
    });
  }
}

export class MatchedItemsDetachAtom extends TestPoint {
  constructor() {
    super("TP-NEW-060", "Detach an atom from the molecule", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /detach/i);
    });
  }
}

export class MatchedItemsSealMolecule extends TestPoint {
  constructor() {
    super("TP-NEW-061", "Seal the molecule", async (page) => {
      await confirmAction(new MatchedItemsPage(page), /seal/i);
    });
  }
}

export class MatchedItemsApplyCombinedFilters extends TestPoint {
  constructor(matchingStatus: string, reconciliationStatus: string) {
    super("TP-NEW-062", "Apply matched-item status filters", async (page) => {
      const pom = new MatchedItemsPage(page);
      await pom.selectDropdownOption(pom.selectMatchingStatus, matchingStatus);
      await pom.selectDropdownOption(pom.selectReconciliationStatus, reconciliationStatus);
    });
  }
}

export class MatchedItemsClearFilters extends TestPoint {
  constructor() {
    super("TP-NEW-063", "Clear Matched Items filters", async (page) => {
      await clearFilters(new MatchedItemsPage(page));
    });
  }
}

export class MatchedItemsClickExport extends TestPoint {
  constructor() {
    super("TP-NEW-064", "Export matched items", async (page) => {
      const pom = new MatchedItemsPage(page);
      await downloadExport(pom, exportButton(pom));
    });
  }
}

export class MatchedItemsAssertExportContent extends TestPoint {
  constructor() {
    super("TP-NEW-065", "Assert the matched-items export matches the grid", async (page) => {
      await assertLastExportMatchesGrid(new MatchedItemsPage(page));
    });
  }
}

export class MatchedItemsOpenAccountingPreview extends TestPoint {
  constructor() {
    super("TP-NEW-066", "Open accounting preview", async (page) => {
      const pom = new MatchedItemsPage(page);
      await clickNamed(pom, /accounting/i);
      await expect(pom.page.locator(".p-dialog, .p-sidebar").last()).toBeVisible();
    });
  }
}

export class MatchedItemsAssertClearingNeutralized extends TestPoint {
  constructor() {
    super("TP-NEW-067", "Assert clearing accounts are neutralized", async (page) => {
      const pom = new MatchedItemsPage(page);
      await assertText(pom, "0");
    });
  }
}

export class MatchedItemsAssertAtomsPending extends TestPoint {
  constructor(itemText: string) {
    super("TP-NEW-068", `Assert atom is pending (${itemText})`, async (page) => {
      const pom = new PendingItemsPage(page);
      await pom.goto();
      await pom.expectTableContains(itemText);
    });
  }
}
