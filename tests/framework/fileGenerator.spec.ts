import fs from "fs";
import os from "os";
import path from "path";
import { test, expect } from "@playwright/test";
import {
  BANK_DEPOSIT_HEADERS,
  GenerateScenarioFiles,
  GenerationSettings,
  planDataset,
  profileFor,
  SALE_HEADERS,
  SETTLEMENT_HEADERS,
} from "../../src/generation";

function settings(): GenerationSettings {
  return {
    outputDir: fs.mkdtempSync(path.join(os.tmpdir(), "adad-gen-")),
    fileSuffix: "10",
    transactionCount: 10,
    paymentDate: "2026-02-13",
    awbPrefixCode: "212",
    airline: "8X",
    accountingCurrency: "EUR",
    officeId: "20300744",
    merchantId: "11223344",
    saleDatasource: "Sale",
    settlementDatasource: "Settlement",
    bankDepositDatasource: "BankDeposit",
    fileReceptionConfiguration: "GLOBAL",
  };
}

function rows(csv: string): Record<string, string>[] {
  const [header, ...lines] = csv.trim().split("\n");
  const names = header.split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((value, i) => [names[i], value])));
}

test.describe("file generator", () => {
  test("default dataset pairs every sale with a settlement on document number and FOP", () => {
    const data = planDataset({ scenarioId: "T-1" }, settings());
    const sales = rows(data.sale.csv);
    const settlements = rows(data.settlement.csv);

    expect(data.sale.csv.split("\n")[0]).toBe(SALE_HEADERS.join(","));
    expect(data.settlement.csv.split("\n")[0]).toBe(SETTLEMENT_HEADERS.join(","));
    expect(data.bankDeposit.csv.split("\n")[0]).toBe(BANK_DEPOSIT_HEADERS.join(","));
    expect(sales).toHaveLength(10);
    expect(data.sale.count).toBe(10);
    expect(data.settlement.count).toBe(10);
    sales.forEach((sale, i) => {
      expect(settlements[i].documentNumber).toBe(sale.documentNumber);
      expect(settlements[i].alternateFormOfPaymentCode).toBe(sale.alternateFormOfPaymentCode);
      expect(settlements[i].grossAmountInSettlementCurrency).toBe(sale.grossAmountInPaymentCurrency);
      expect(sale.documentNumber).toMatch(/^212\d{10}$/);
      expect(sale.paymentCurrency).toBe("EUR");
    });
    expect(new Set(sales.map((s) => s.documentNumber)).size).toBe(10);
    expect(data.documentNumber).toBe(sales[0].documentNumber);
    expect(data.paymentDateRange).toBe("01/02/2026 - 28/02/2026");
    expect(data.paymentDateUi).toBe("13/02/2026");
    expect(data.sale.fileName).toMatch(/^Sale_GLOBAL_10_2\d{3}-\d{2}-\d{2}T\d{2}\.\d{2}\.\d{2}\.\d{3}Z\.csv$/);
    expect(data.settlement.fileName).toMatch(/^Settlement_GLOBAL_10_/);
  });

  test("two datasets never reuse document numbers or PNRs", () => {
    const a = planDataset({ scenarioId: "A" }, settings());
    const b = planDataset({ scenarioId: "B" }, settings());
    const docs = [...a.sales, ...b.sales].map((s) => s.documentNumber);
    const pnrs = [...a.sales, ...b.sales].map((s) => s.pnrReference);
    expect(new Set(docs).size).toBe(docs.length);
    expect(new Set(pnrs).size).toBe(pnrs.length);
  });

  test("card strategy keeps card keys but changes document and PNR", () => {
    const data = planDataset({ scenarioId: "T", strategy: "cardAndApprovalCode" }, settings());
    data.sales.forEach((sale, i) => {
      const settlement = data.settlements[i];
      expect(settlement.documentNumber).not.toBe(sale.documentNumber);
      expect(settlement.pnrReference).not.toBe(sale.pnrReference);
      expect([settlement.ccBin, settlement.ccFourLastDigits, settlement.approvalCode]).toEqual([
        sale.ccBin,
        sale.ccFourLastDigits,
        sale.approvalCode,
      ]);
    });
  });

  test("many-to-many groups share card keys", () => {
    const data = planDataset({ scenarioId: "T", strategy: "manyToMany" }, settings());
    expect(data.sales).toHaveLength(10);
    const keys = new Set(data.sales.map((s) => `${s.ccBin}-${s.ccFourLastDigits}-${s.approvalCode}`));
    expect(keys.size).toBe(2);
  });

  test("one-to-many and many-to-one split amounts without losing cents", () => {
    const oneToMany = planDataset({ scenarioId: "T", strategy: "oneToMany", transactionCount: 3 }, settings());
    expect(oneToMany.sales).toHaveLength(3);
    expect(oneToMany.settlements).toHaveLength(6);
    const manyToOne = planDataset({ scenarioId: "T", strategy: "manyToOne", transactionCount: 3 }, settings());
    expect(manyToOne.sales).toHaveLength(6);
    expect(manyToOne.settlements).toHaveLength(3);
    const cents = (v: string) => Math.round(Number(v) * 100);
    oneToMany.sales.forEach((sale, i) => {
      const parts = oneToMany.settlements.slice(i * 2, i * 2 + 2);
      expect(parts.every((p) => p.documentNumber === sale.documentNumber)).toBe(true);
      expect(cents(parts[0].amount) + cents(parts[1].amount)).toBe(cents(sale.amount));
    });
  });

  test("bank deposit sums settlements per currency and date", () => {
    const data = planDataset({ scenarioId: "T", multiCurrency: true, transactionCount: 6 }, settings());
    const deposits = rows(data.bankDeposit.csv);
    expect(deposits).toHaveLength(3);
    const total = (list: { amount: string }[]) => list.reduce((sum, t) => sum + Math.round(Number(t.amount) * 100), 0);
    const depositTotal = deposits.reduce((sum, d) => sum + Math.round(Number(d.amountInDepositCurrency) * 100), 0);
    expect(depositTotal).toBe(total(data.settlements));
  });

  test("variants produce the intended bad data", () => {
    const s = settings();
    expect(rows(planDataset({ scenarioId: "T", variant: "duplicateTransaction" }, s).sale.csv)).toHaveLength(11);
    expect(rows(planDataset({ scenarioId: "T", variant: "unknownFop" }, s).sale.csv)[0].alternateFormOfPaymentCode).toBe("ZZZZ");
    expect(rows(planDataset({ scenarioId: "T", variant: "missingMerchant" }, s).settlement.csv)[0].merchantId).toBe("");
    expect(planDataset({ scenarioId: "T", variant: "corruptedStructure" }, s).sale.csv.split("\n")[0]).not.toContain("documentNumber");
    const discrepancy = planDataset({ scenarioId: "T", variant: "amountDiscrepancy" }, s);
    expect(rows(discrepancy.settlement.csv)[0].grossAmountInSettlementCurrency).not.toBe(discrepancy.sales[0].amount);
    const refunds = rows(planDataset({ scenarioId: "T", withRefunds: true }, s).sale.csv);
    expect(refunds.filter((r) => r.transactionType === "REFUND")).toHaveLength(10);
  });

  test("GenerateScenarioFiles writes the files and a manifest", async () => {
    const data = planDataset({ scenarioId: "T-W" }, settings());
    await new GenerateScenarioFiles(data).run({} as never);
    for (const file of [data.sale, data.settlement, data.bankDeposit]) {
      expect(fs.readFileSync(file.filePath, "utf8")).toBe(file.csv);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(data.dir, "manifest.json"), "utf8"));
    expect(manifest.documentNumber).toBe(data.documentNumber);
    expect(manifest.files).toHaveLength(3);
  });

  test("scenario profiles", () => {
    expect(profileFor("MR-03", "Many-to-many match, settlement reconciliation, mono-currency")).toEqual({ strategy: "manyToMany" });
    expect(profileFor("MR-02", "Basic 1:1 match, settlement reconciliation, multi-currency").multiCurrency).toBe(true);
    expect(profileFor("DI-10", "Missing master data (FOP)").variant).toBe("unknownFop");
    expect(profileFor("MR-28", "Settlement sealing with discrepancy").variant).toBe("amountDiscrepancy");
    expect(profileFor("E2E-03", "Sale and refund matching").withRefunds).toBe(true);
  });
});
