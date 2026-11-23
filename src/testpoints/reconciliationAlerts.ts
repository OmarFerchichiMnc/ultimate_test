// TestPoints used by the scenario specs (reconciliationAlerts). One file per domain: add a TestPoint to the
// file of its screen so two people adding tests rarely edit the same file.
import { TestPoint } from "../testpoint/TestPoint";
import { ReconciliationAlertsPage } from "../pages/reconciliationAlerts.page";
import { assertAnyStatus, confirmAction } from "../pages/scenarioSupport";

export class ReconciliationAlertsFilterMolecule extends TestPoint {
  constructor(moleculeId: string) {
    super("TP-NEW-093", `Filter reconciliation alerts by ${moleculeId}`, async (page) => {
      const pom = new ReconciliationAlertsPage(page);
      const box = pom.page.getByRole("textbox").first();
      await box.fill(moleculeId);
      await pom.search.click();
    });
  }
}

export class ReconciliationAlertsAssign extends TestPoint {
  constructor() {
    super("TP-NEW-094", "Assign the discrepancy alert", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /assign/i);
    });
  }
}

export class ReconciliationAlertsAccept extends TestPoint {
  constructor() {
    super("TP-NEW-095", "Accept the discrepancy", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /accept/i);
    });
  }
}

export class ReconciliationAlertsDispute extends TestPoint {
  constructor() {
    super("TP-NEW-096", "Dispute the discrepancy", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /dispute/i);
    });
  }
}

export class ReconciliationAlertsResolve extends TestPoint {
  constructor() {
    super("TP-NEW-097", "Resolve the discrepancy", async (page) => {
      await confirmAction(new ReconciliationAlertsPage(page), /resolve/i);
    });
  }
}

export class ReconciliationAlertsAssertStatus extends TestPoint {
  constructor(status: string) {
    super("TP-NEW-098", `Assert alert status ${status}`, async (page) => {
      await assertAnyStatus(new ReconciliationAlertsPage(page), status);
    });
  }
}
