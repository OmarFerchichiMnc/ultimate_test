import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenCashForecastPage, CashForecastFilterDateRange, CashForecastSelectCustomerAcquirer, CashForecastSelectCurrency, CashForecastRefresh, CashForecastAssertDiagram } from "../../src/pages";

test.describe("Data Ingestion", () => {
  test("DI-23 Cash forecast", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenCashForecastPage(),
      new CashForecastFilterDateRange("01/01/2026 - 31/01/2026"),
      new CashForecastSelectCustomerAcquirer("adyen"),
      new CashForecastSelectCurrency("EUR"),
      new CashForecastRefresh(),
      new CashForecastAssertDiagram(),
    ]);
  });
});
