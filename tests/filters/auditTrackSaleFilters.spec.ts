import { test } from "../../src/fixtures/auth";
import { fetchRows, firstPopulated, monthContaining, queries } from "../../src/configuration/database";
import {
  SaleUIAddFilters,
  SaleUICheckIfSaleTableEmpty,
  SaleUICheckIfSaleTableNotEmpty,
  SaleUIClickSearch,
  SaleUIClickSearchQuickFilter,
  SaleUIFilterApprovalCode,
  SaleUIFilterChannelType,
  SaleUIFilterCountry,
  SaleUIFilterCreditCard4LastDegits,
  SaleUIFilterCreditCardBIN,
  SaleUIFilterDocumentNumber,
  SaleUIFilterFOPCode,
  SaleUIFilterFOPSubCode,
  SaleUIFilterFileID,
  SaleUIFilterPNROrderReference,
  SaleUIFilterPaymentID,
  SaleUIFilterSaleID,
  SaleUIFilterSettledStatus,
} from "../../src/pages/saleAuditTrack.page";
import { TestPoint } from "../../src/testpoint/TestPoint";
import { runTestPoints } from "../runTestPoints";
import { AdvancedCombo, saleAdvancedCombos } from "./advancedCombos";
import { openSaleAuditTrack, openSaleAuditTrackForMonth } from "./loadRows";

function saleAdvancedPoints(combo: AdvancedCombo, expectEmpty: boolean): TestPoint[] {
  const extra = Boolean(combo.fopCode || combo.fopSub || combo.settledStatus);
  return [
    new SaleUIFilterChannelType(combo.channel),
    new SaleUIFilterCountry(combo.country),
    new SaleUIFilterFileID(combo.fileId),
    ...(extra
      ? [
          new SaleUIAddFilters(),
          new SaleUIFilterFOPCode(combo.fopCode),
          new SaleUIFilterFOPSubCode(combo.fopSub),
          new SaleUIFilterSettledStatus(combo.settledStatus),
        ]
      : []),
    new SaleUIClickSearch(),
    expectEmpty ? new SaleUICheckIfSaleTableEmpty() : new SaleUICheckIfSaleTableNotEmpty(),
  ];
}

async function latestSale(field?: string) {
  const rows = await fetchRows(queries.recentSales);
  const sale = field ? firstPopulated(rows, field) : rows[0];
  test.skip(!sale, field ? `No sale with ${field} in the database` : "No sales returned from the database");
  return sale!;
}

test.describe("audit track sale quick filters", () => {
  test("sale id filter", async ({ loggedInPage }) => {
    const sale = await latestSale();
    await openSaleAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SaleUIFilterSaleID(String(sale.id)),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
    ]);
  });

  test("document number filter", async ({ loggedInPage }) => {
    const sale = await latestSale("document_number");
    await openSaleAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SaleUIFilterDocumentNumber(String(sale.document_number)),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
    ]);
  });

  test("pnr order reference filter", async ({ loggedInPage }) => {
    const sale = await latestSale("pnr_reference");
    await openSaleAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SaleUIFilterPNROrderReference(String(sale.pnr_reference)),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
    ]);
  });

  test("payment id filter", async ({ loggedInPage }) => {
    const sale = await latestSale("payment_id");
    await openSaleAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SaleUIFilterPaymentID(String(sale.payment_id)),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
    ]);
  });

  test("credit card number filter", async ({ loggedInPage }) => {
    const sale = await latestSale("cc_bin");
    test.skip(!sale.cc_four_last_digits, "No credit card last 4 on the sale");
    await openSaleAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SaleUIFilterCreditCardBIN(String(sale.cc_bin)),
      new SaleUIFilterCreditCard4LastDegits(String(sale.cc_four_last_digits)),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
    ]);
  });

  test("approval code filter", async ({ loggedInPage }) => {
    const sale = await latestSale("approval_code");
    await openSaleAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new SaleUIFilterApprovalCode(String(sale.approval_code)),
      new SaleUIClickSearchQuickFilter(),
      new SaleUICheckIfSaleTableNotEmpty(),
    ]);
  });
});

test.describe("audit track sale advanced filters", () => {
  test("positive combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentSales);
    test.skip(!rows.length, "No sales returned from the database");
    const { positives } = saleAdvancedCombos(rows);
    test.skip(!positives.length, "No positive advanced filter combinations");
    for (const [index, combo] of positives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "positive"}`, async () => {
        await openSaleAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, saleAdvancedPoints(combo, false));
      });
    }
  });

  test("negative combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentSales);
    test.skip(!rows.length, "No sales returned from the database");
    const { negatives } = saleAdvancedCombos(rows);
    test.skip(!negatives.length, "No negative advanced filter combinations");
    for (const [index, combo] of negatives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "negative"}`, async () => {
        await openSaleAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, saleAdvancedPoints(combo, true));
      });
    }
  });
});
