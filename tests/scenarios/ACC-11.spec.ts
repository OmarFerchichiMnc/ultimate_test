import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPostToLedgerPage, PostToLedgerGenerate, PostToLedgerAssertFile } from "../../src/pages";

test.describe("Accounting", () => {
  test("ACC-11 Generate the general ledger file", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPostToLedgerPage(),
      new PostToLedgerGenerate(),
      new PostToLedgerAssertFile(),
    ]);
  });
});
