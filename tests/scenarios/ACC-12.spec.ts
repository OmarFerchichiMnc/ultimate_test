import { test } from "../../src/fixtures/auth";
import { runTestPoints } from "../runTestPoints";
import { OpenPostToLedgerPage, PostToLedgerAssertFile } from "../../src/pages";

test.describe("Accounting", () => {
  test("ACC-12 GL file structure", async ({ loggedInPage }) => {
    test.setTimeout(600_000);
    await runTestPoints(loggedInPage, [
      new OpenPostToLedgerPage(),
      new PostToLedgerAssertFile(),
    ]);
  });
});
