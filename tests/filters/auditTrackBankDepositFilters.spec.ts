import { test } from "../../src/fixtures/auth";
import { fetchRows, firstPopulated, monthContaining, queries } from "../../src/configuration/database";
import {
  BankUIAddFilters,
  BankUICheckIfTableEmpty,
  BankUICheckIfTableNotEmpty,
  BankUIClickSearch,
  BankUIClickSearchQuickFilter,
  BankUIFilterBankAccountNumber,
  BankUIFilterBankDepositID,
  BankUIFilterBankDepositReference,
  BankUIFilterBankedStatus,
  BankUIFilterCustomerAcquirer,
  BankUIFilterFileID,
} from "../../src/pages/bankAuditTrack.page";
import { TestPoint } from "../../src/testpoint/TestPoint";
import { runTestPoints } from "../runTestPoints";
import { AdvancedCombo, bankDepositAdvancedCombos } from "./advancedCombos";
import { openBankAuditTrack, openBankAuditTrackForMonth } from "./loadRows";

function bankAdvancedPoints(combo: AdvancedCombo, expectEmpty: boolean): TestPoint[] {
  const extra = Boolean(combo.bankedStatus || combo.fileId);
  return [
    new BankUIFilterCustomerAcquirer(combo.acquirer),
    new BankUIFilterBankDepositReference(combo.bankDepositReference),
    new BankUIFilterBankAccountNumber(combo.bankAccountNumber),
    ...(extra
      ? [new BankUIAddFilters(), new BankUIFilterBankedStatus(combo.bankedStatus), new BankUIFilterFileID(combo.fileId)]
      : []),
    new BankUIClickSearch(),
    expectEmpty ? new BankUICheckIfTableEmpty() : new BankUICheckIfTableNotEmpty(),
  ];
}

async function latestBankDeposit(field?: string) {
  const rows = await fetchRows(queries.recentBankDeposits);
  const deposit = field ? firstPopulated(rows, field) : rows[0];
  test.skip(
    !deposit,
    field ? `No bank deposit with ${field} in the database` : "No bank deposits returned from the database",
  );
  return deposit!;
}

test.describe("audit track bank deposit quick filters", () => {
  test("bank deposit id filter", async ({ loggedInPage }) => {
    const deposit = await latestBankDeposit();
    await openBankAuditTrack(loggedInPage);
    await runTestPoints(loggedInPage, [
      new BankUIFilterBankDepositID(String(deposit.id)),
      new BankUIClickSearchQuickFilter(),
      new BankUICheckIfTableNotEmpty(),
    ]);
  });
});

test.describe("audit track bank deposit advanced filters", () => {
  test("positive combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentBankDeposits);
    test.skip(!rows.length, "No bank deposits returned from the database");
    const { positives } = bankDepositAdvancedCombos(rows);
    test.skip(!positives.length, "No positive bank deposit advanced filter combinations");
    for (const [index, combo] of positives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "positive"}`, async () => {
        await openBankAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, bankAdvancedPoints(combo, false));
      });
    }
  });

  test("negative combinations", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    const rows = await fetchRows(queries.recentBankDeposits);
    test.skip(!rows.length, "No bank deposits returned from the database");
    const { negatives } = bankDepositAdvancedCombos(rows);
    test.skip(!negatives.length, "No negative bank deposit advanced filter combinations");
    for (const [index, combo] of negatives.entries()) {
      await test.step(`${index + 1}. ${combo.label || "negative"}`, async () => {
        await openBankAuditTrackForMonth(loggedInPage, monthContaining(combo.paymentDate));
        await runTestPoints(loggedInPage, bankAdvancedPoints(combo, true));
      });
    }
  });
});
