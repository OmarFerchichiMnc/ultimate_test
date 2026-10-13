import { test } from "../../src/fixtures/auth";
import { fetchRows, firstPopulated, monthContaining, queries } from "../../src/configuration/database";
import {
  PaymentOrderUIAddFilters,
  PaymentOrderUICheckIfTableEmpty,
  PaymentOrderUICheckIfTableNotEmpty,
  PaymentOrderUIClickSearch,
  PaymentOrderUIClickSearchQuickFilter,
  PaymentOrderUIFilterBankDepositReference,
  PaymentOrderUIFilterBankedStatus,
  PaymentOrderUIFilterCustomerAcquirer,
  PaymentOrderUIFilterFileID,
  PaymentOrderUIFilterPaymentOrderID,
  PaymentOrderUIFilterPaymentOrderReference,
} from "../../src/pages/paymentOrderAuditTrack.page";
import { TestPoint } from "../../src/testpoint/TestPoint";
import { runTestPoints } from "../runTestPoints";
import { AdvancedCombo, paymentOrderAdvancedCombos } from "./advancedCombos";
import { openPaymentOrderAuditTrack, openPaymentOrderAuditTrackForMonth } from "./loadRows";

function paymentOrderAdvancedPoints(combo: AdvancedCombo, expectEmpty: boolean): TestPoint[] {
  const extra = Boolean(combo.bankedStatus || combo.fileId);
  return [
    new PaymentOrderUIFilterCustomerAcquirer(combo.acquirer),
    new PaymentOrderUIFilterPaymentOrderReference(combo.paymentOrderReference),
    new PaymentOrderUIFilterBankDepositReference(combo.bankDepositReference),
    ...(extra
      ? [
          new PaymentOrderUIAddFilters(),
          new PaymentOrderUIFilterBankedStatus(combo.bankedStatus),
          new PaymentOrderUIFilterFileID(combo.fileId),
        ]
      : []),
    new PaymentOrderUIClickSearch(),
    expectEmpty ? new PaymentOrderUICheckIfTableEmpty() : new PaymentOrderUICheckIfTableNotEmpty(),
  ];
}

async function latestPaymentOrder(field?: string) {
  const rows = await fetchRows(queries.recentPaymentOrders);
  const order = field ? firstPopulated(rows, field) : rows[0];
  test.skip(
    !order,
    field ? `No payment order with ${field} in the database` : "No payment orders returned from the database",
  );
  return order!;
}

test.describe("audit track payment order quick filters", () => {
  test("payment order id filter", async ({ loggedInPage }) => {
    const order = await latestPaymentOrder();
    await openPaymentOrderAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new PaymentOrderUIFilterPaymentOrderID(String(order.id)),
      new PaymentOrderUIClickSearchQuickFilter(),
      new PaymentOrderUICheckIfTableNotEmpty(),
    ]);
  });
});

test.describe("audit track payment order advanced filters", () => {
  test("positive combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentPaymentOrders);
    test.skip(!rows.length, "No payment orders returned from the database");
    const { positives } = paymentOrderAdvancedCombos(rows);
    test.skip(!positives.length, "No positive payment order advanced filter combinations");
    for (const [index, combo] of positives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "positive"}`, async () => {
        await openPaymentOrderAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, paymentOrderAdvancedPoints(combo, false));
      });
    }
  });

  test("negative combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentPaymentOrders);
    test.skip(!rows.length, "No payment orders returned from the database");
    const { negatives } = paymentOrderAdvancedCombos(rows);
    test.skip(!negatives.length, "No negative payment order advanced filter combinations");
    for (const [index, combo] of negatives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "negative"}`, async () => {
        await openPaymentOrderAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, paymentOrderAdvancedPoints(combo, true));
      });
    }
  });
});
