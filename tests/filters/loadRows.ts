import { Page } from "@playwright/test";
import {
  OpenSaleAuditTrackPage,
  SaleAuditTrackPage,
  SaleUIClearQuickFilter,
  SaleUIFilterPaymentDateRange,
} from "../../src/pages/saleAuditTrack.page";
import {
  OpenSettlementAuditTrackPage,
  SettlementAuditTrackPage,
  SettlementUIClearQuickFilter,
  SettlementUIFilterPaymentDateRange,
} from "../../src/pages/settlementAuditTrack.page";
import {
  OpenPaymentOrderAuditTrackPage,
  PaymentOrderAuditTrackPage,
  PaymentOrderUIClearQuickFilter,
  PaymentOrderUIFilterPaymentOrderDateRange,
} from "../../src/pages/paymentOrderAuditTrack.page";
import {
  BankAuditTrackPage,
  BankUIClearQuickFilter,
  BankUIFilterBankDepositDateRange,
  OpenBankAuditTrackPage,
} from "../../src/pages/bankAuditTrack.page";

export async function openSaleAuditTrack(page: Page): Promise<SaleAuditTrackPage> {
  await new OpenSaleAuditTrackPage().run(page);
  return new SaleAuditTrackPage(page);
}

export async function openSaleAuditTrackForMonth(page: Page, range: string): Promise<SaleAuditTrackPage> {
  await openSaleAuditTrack(page);
  await new SaleUIClearQuickFilter().run(page);
  await new SaleUIFilterPaymentDateRange(range).run(page);
  return new SaleAuditTrackPage(page);
}

export async function openSettlementAuditTrack(page: Page): Promise<SettlementAuditTrackPage> {
  await new OpenSettlementAuditTrackPage().run(page);
  return new SettlementAuditTrackPage(page);
}

export async function openSettlementAuditTrackForMonth(
  page: Page,
  range: string,
): Promise<SettlementAuditTrackPage> {
  await openSettlementAuditTrack(page);
  await new SettlementUIClearQuickFilter().run(page);
  await new SettlementUIFilterPaymentDateRange(range).run(page);
  return new SettlementAuditTrackPage(page);
}

export async function openPaymentOrderAuditTrack(page: Page): Promise<PaymentOrderAuditTrackPage> {
  await new OpenPaymentOrderAuditTrackPage().run(page);
  return new PaymentOrderAuditTrackPage(page);
}

export async function openPaymentOrderAuditTrackForMonth(
  page: Page,
  range: string,
): Promise<PaymentOrderAuditTrackPage> {
  await openPaymentOrderAuditTrack(page);
  await new PaymentOrderUIClearQuickFilter().run(page);
  await new PaymentOrderUIFilterPaymentOrderDateRange(range).run(page);
  return new PaymentOrderAuditTrackPage(page);
}

export async function openBankAuditTrack(page: Page): Promise<BankAuditTrackPage> {
  await new OpenBankAuditTrackPage().run(page);
  return new BankAuditTrackPage(page);
}

export async function openBankAuditTrackForMonth(page: Page, range: string): Promise<BankAuditTrackPage> {
  await openBankAuditTrack(page);
  await new BankUIClearQuickFilter().run(page);
  await new BankUIFilterBankDepositDateRange(range).run(page);
  return new BankAuditTrackPage(page);
}
