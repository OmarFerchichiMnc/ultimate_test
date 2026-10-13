import { test } from "../../src/fixtures/auth";
import { PAGE_INVENTORY } from "../../src/pages";

test.describe("navigation by link", () => {
  for (const page of PAGE_INVENTORY) {
    const open = page.testPoints()[0];
    test(`${open.id} ${page.path}`, async ({ loggedInPage }) => {
      await open.run(loggedInPage);
    });
  }
});
