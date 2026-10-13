import { test } from "../../src/fixtures/auth";
import { dateRangeCovering, fetchRows, queries } from "../../src/configuration/database";
import {
  SettlementUIAddFilters,
  SettlementUICheckRowCountMatchesDatabase,
  SettlementUIClickSearch,
  SettlementUIFilterPaymentOrderReference,
} from "../../src/pages/settlementAuditTrack.page";
import { runTestPoints } from "../runTestPoints";
import { openSettlementAuditTrackForMonth } from "./loadRows";

const PAYMENT_ORDER_REFERENCE = "paymentOrderReference9";

test("payment order reference filter shows no duplicated settlements", async ({ loggedInPage }) => {
  const settlements = await fetchRows(queries.settlementsByPaymentOrderReference, [PAYMENT_ORDER_REFERENCE]);
  test.skip(!settlements.length, `No settlement with ${PAYMENT_ORDER_REFERENCE} in the database`);
  await openSettlementAuditTrackForMonth(
    loggedInPage,
    dateRangeCovering(settlements.map((row) => row.settlement_date)),
  );
  await runTestPoints(loggedInPage, [
    new SettlementUIAddFilters(),
    new SettlementUIFilterPaymentOrderReference(PAYMENT_ORDER_REFERENCE),
    new SettlementUIClickSearch(),
    new SettlementUICheckRowCountMatchesDatabase(settlements),
  ]);
});
