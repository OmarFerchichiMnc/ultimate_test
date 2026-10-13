import { chromium, Page } from "@playwright/test";
import { config } from "./config";
import { logger } from "./logger";

function appHost(): string {
  return new URL(config.app.baseUrl).hostname;
}

function isAppUrl(url: URL): boolean {
  return url.hostname === appHost();
}

async function isBadGateway(page: Page, status?: number): Promise<boolean> {
  if (status !== undefined && status >= 500) return true;
  return (await page.getByRole("heading", { name: /502 Bad Gateway/i }).count()) > 0;
}

async function gotoApp(page: Page): Promise<void> {
  let lastStatus = 0;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await page.goto(config.app.baseUrl, { waitUntil: "domcontentloaded" });
    lastStatus = response?.status() ?? 0;
    if (!(await isBadGateway(page, lastStatus))) return;
    logger.warn(`App returned ${lastStatus || 502} on login attempt ${attempt}/3`);
    await page.waitForTimeout(2000);
  }
  throw new Error(`Failed to open ${config.app.baseUrl} (last status ${lastStatus || 502})`);
}

export async function loginToAdad(page: Page): Promise<void> {
  const username = config.auth.username || config.auth.uiEmail;
  const password = config.auth.password || config.auth.uiPassword;

  if (!username || !password) {
    throw new Error("AUTH_USERNAME and AUTH_PASSWORD must be set in .env");
  }

  logger.info(`Opening ${config.app.baseUrl}`);
  await gotoApp(page);

  const usernameField = page.locator("#username");
  const appRoot = page.locator("app-root");

  if ((await appRoot.count()) > 0 && (await appRoot.first().isVisible()) && !(await usernameField.isVisible().catch(() => false))) {
    logger.info("Already logged in");
    return;
  }

  await usernameField.waitFor({ state: "visible", timeout: 30_000 });
  await usernameField.fill(username);
  await page.locator("#password").fill(password);
  await page.locator("#kc-login").click();

  await page.waitForURL((url) => isAppUrl(url), { timeout: 30_000 });
  await appRoot.waitFor({ state: "visible" });
  logger.info("Successfully logged in with username/password");
}

export async function createLoggedInPage() {
  const browser = await chromium.launch({
    headless: config.app.headless,
    slowMo: config.app.slowMoMs,
    args: ["--start-maximized"],
  });
  const context = await browser.newContext({
    baseURL: config.app.baseUrl,
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  await loginToAdad(page);
  return { browser, context, page };
}
