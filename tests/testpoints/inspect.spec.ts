import { test } from "../../src/fixtures/auth";
import { inventorySuites } from "./suites";

test.describe("TestPoint health checks", () => {
  for (const suite of inventorySuites()) {
    const [open, ...controls] = suite.testpoints;

    test.describe(suite.path, () => {
      test(`${open.id} ${open.description}`, async ({ loggedInPage }) => {
        await open.run(loggedInPage);
      });

      for (const testpoint of controls) {
        test(`${testpoint.id} ${testpoint.description}`, async ({ loggedInPage }) => {
          await open.run(loggedInPage);
          await testpoint.run(loggedInPage);
        });
      }
    });
  }
});
