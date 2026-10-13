import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenSaleAuditTrackPage, SaleUIFilterSaleID, SaleUIClickSearchQuickFilter, SaleAuditTrackOpenAccountingDetails, SaleAuditTrackOpenGroupHeader, OpenGlDetailsPage, GlDetailsAssertGroupHeader } from "../../src/pages";

test.describe("Accounting", () => {
  test("ACC-24 Open GL details from the accounting group header", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenSaleAuditTrackPage(),
      new SaleUIFilterSaleID("1"),
      new SaleUIClickSearchQuickFilter(),
      new SaleAuditTrackOpenAccountingDetails(),
      new SaleAuditTrackOpenGroupHeader(),
      new OpenGlDetailsPage(),
      new GlDetailsAssertGroupHeader("1"),
    ]);
  });
});
