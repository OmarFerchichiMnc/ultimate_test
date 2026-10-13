import { defineConfig, devices } from "@playwright/test";
import { config } from "./src/configuration/config";
import { reportPath } from "./src/configuration/reportRun";

const runDir = {
  html: reportPath("html"),
  json: reportPath("results.json"),
  artifacts: reportPath("artifacts"),
};

export default defineConfig({
  testDir: "./tests",
  outputDir: runDir.artifacts,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 5 * 60 * 1000,
  expect: { timeout: 15_000 },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: runDir.html }],
    ["json", { outputFile: runDir.json }],
    ["./src/configuration/adadReporter.ts"],
  ],
  use: {
    baseURL: config.app.baseUrl,
    headless: config.app.headless,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 15_000,
    navigationTimeout: config.app.navigationTimeoutMs,
    screenshot: "on",
    video: "on",
    trace: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
