import { test } from "../../src/fixtures/auth";
import { fetchRows, firstPopulated, monthContaining, queries } from "../../src/configuration/database";
import {
  SettlementUIAddFilters,
  SettlementUICheckIfSettlementTableEmpty,
  SettlementUICheckIfSettlementTableNotEmpty,
  SettlementUIClickSearch,
  SettlementUIClickSearchQuickFilter,
  SettlementUIFilterApprovalCode,
  SettlementUIFilterCountry,
  SettlementUIFilterCreditCard4LastDegits,
  SettlementUIFilterCreditCardBIN,
  SettlementUIFilterCustomerAcquirer,
  SettlementUIFilterDocumentNumber,
  SettlementUIFilterFOPCode,
  SettlementUIFilterFOPSubCode,
  SettlementUIFilterFileID,
  SettlementUIFilterPNROrderReference,
  SettlementUIFilterPaymentID,
  SettlementUIFilterPaymentOrderReference,
  SettlementUIFilterSettledStatus,
  SettlementUIFilterSettlementID,
} from "../../src/pages/settlementAuditTrack.page";
import { TestPoint } from "../../src/testpoint/TestPoint";
import { runTestPoints } from "../runTestPoints";
import { AdvancedCombo, settlementAdvancedCombos } from "./advancedCombos";
import { openSettlementAuditTrack, openSettlementAuditTrackForMonth } from "./loadRows";

function settlementAdvancedPoints(combo: AdvancedCombo, expectEmpty: boolean): TestPoint[] {
  const extra = Boolean(combo.fopCode || combo.fopSub || combo.settledStatus || combo.paymentOrderReference);
  return [
    new SettlementUIFilterCustomerAcquirer(combo.acquirer),
    new SettlementUIFilterCountry(combo.country),
    new SettlementUIFilterFileID(combo.fileId),
    ...(extra
      ? [
          new SettlementUIAddFilters(),
          new SettlementUIFilterFOPCode(combo.fopCode),
          new SettlementUIFilterFOPSubCode(combo.fopSub),
          new SettlementUIFilterPaymentOrderReference(combo.paymentOrderReference),
          new SettlementUIFilterSettledStatus(combo.settledStatus),
        ]
      : []),
    new SettlementUIClickSearch(),
    expectEmpty ? new SettlementUICheckIfSettlementTableEmpty() : new SettlementUICheckIfSettlementTableNotEmpty(),
  ];
}

async function latestSettlement(field?: string) {
  const rows = await fetchRows(queries.recentSettlements);
  const settlement = field ? firstPopulated(rows, field) : rows[0];
  test.skip(
    !settlement,
    field ? `No settlement with ${field} in the database` : "No settlements returned from the database",
  );
  return settlement!;
}

test.describe("audit track settlement quick filters", () => {
  test("settlement id filter", async ({ loggedInPage }) => {
    const settlement = await latestSettlement();
    await openSettlementAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SettlementUIFilterSettlementID(String(settlement.id)),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
    ]);
  });

  test("document number filter", async ({ loggedInPage }) => {
    const settlement = await latestSettlement("document_number");
    await openSettlementAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SettlementUIFilterDocumentNumber(String(settlement.document_number)),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
    ]);
  });

  test("pnr order reference filter", async ({ loggedInPage }) => {
    const settlement = await latestSettlement("pnr_reference");
    await openSettlementAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SettlementUIFilterPNROrderReference(String(settlement.pnr_reference)),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
    ]);
  });

  test("payment id filter", async ({ loggedInPage }) => {
    const settlement = await latestSettlement("payment_id");
    await openSettlementAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SettlementUIFilterPaymentID(String(settlement.payment_id)),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
    ]);
  });

  test("credit card number filter", async ({ loggedInPage }) => {
    const settlement = await latestSettlement("cc_bin");
    test.skip(!settlement.cc_four_last_digits, "No credit card last 4 on the settlement");
    await openSettlementAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SettlementUIFilterCreditCardBIN(String(settlement.cc_bin)),
      new SettlementUIFilterCreditCard4LastDegits(String(settlement.cc_four_last_digits)),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
    ]);
  });

  test("approval code filter", async ({ loggedInPage }) => {
    const settlement = await latestSettlement("approval_code");
    await openSettlementAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SettlementUIFilterApprovalCode(String(settlement.approval_code)),
      new SettlementUIClickSearchQuickFilter(),
      new SettlementUICheckIfSettlementTableNotEmpty(),
    ]);
  });
});

test.describe("audit track settlement advanced filters", () => {
  test("positive combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentSettlements);
    test.skip(!rows.length, "No settlements returned from the database");
    const { positives } = settlementAdvancedCombos(rows);
    test.skip(!positives.length, "No positive advanced filter combinations");
    for (const [index, combo] of positives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "positive"}`, async () => {
        await openSettlementAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, settlementAdvancedPoints(combo, false));
      });
    }
  });

  test("negative combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentSettlements);
    test.skip(!rows.length, "No settlements returned from the database");
    const { negatives } = settlementAdvancedCombos(rows);
    test.skip(!negatives.length, "No negative advanced filter combinations");
    for (const [index, combo] of negatives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "negative"}`, async () => {
        await openSettlementAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, settlementAdvancedPoints(combo, true));
      });
    }
  });
});
