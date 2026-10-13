import { test as base, expect, Page } from "@playwright/test";
import path from "path";
import { loginToAdad } from "../configuration/login";
import { startTestLog } from "../configuration/logger";
import { config } from "../configuration/config";

type WorkerFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<{}, WorkerFixtures>({
  loggedInPage: [
    async ({ browser }, use) => {
      if (!(config.auth.username || config.auth.uiEmail) || !(config.auth.password || config.auth.uiPassword)) {
        throw new Error("Set AUTH_USERNAME and AUTH_PASSWORD in .env before running UI tests");
      }
      const context = await browser.newContext({
        baseURL: config.app.baseUrl,
        viewport: { width: 1920, height: 1080 },
      });
      const page = await context.newPage();
      await loginToAdad(page);
      await use(page);
      await context.close();
    },
    { scope: "worker" },
  ],
});

test.beforeEach(async ({}, testInfo) => {
  const fileName = path.basename(testInfo.file).replace(/\.ts$/, "");
  startTestLog(fileName, testInfo.title.replace(/\s+/g, "_"));
});

export { expect };
