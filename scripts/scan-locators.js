/**
 * Login and dump live locators on audit-track / matching pages.
 * Writes reports/locator-scan.json — does not print credentials.
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.ADAD_BASE_URL || "https://qa.staging.adad.io";
const USERNAME = process.env.AUTH_USERNAME || process.env.ADAD_UI_EMAIL;
const PASSWORD = process.env.AUTH_PASSWORD || process.env.ADAD_UI_PASSWORD;

const PAGES = [
  { name: "sale", path: "/audit-track/sale", host: "adad-frontend-sales-audit-track" },
  { name: "settlement", path: "/audit-track/settlement", host: "adad-frontend-settlements-audit-track" },
  {
    name: "paymentOrder",
    path: "/audit-track/settlement",
    host: "adad-frontend-payment-orders-audit-track",
    tab: "Payment Order",
  },
  { name: "bank", path: "/audit-track/bank", host: "adad-frontend-bank-deposits-audit-track" },
  { name: "manualMatching", path: "/manual-matching", host: "adad-frontend-manual-matching" },
  { name: "fileDashboard", path: "/etl-files", host: "adad-frontend-etl-files, adad-frontend-file-dashboard" },
  { name: "matchedItems", path: "/matched-items", host: "adad-frontend-matched-items" },
  { name: "dashboard", path: "/dashboard", host: "adad-frontend-dashboard" },
];

async function login(page) {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const usernameField = page.locator("#username");
  const appRoot = page.locator("app-root");
  if ((await appRoot.count()) && (await appRoot.first().isVisible()) && !(await usernameField.isVisible().catch(() => false))) {
    return;
  }
  await usernameField.waitFor({ state: "visible", timeout: 30_000 });
  await usernameField.fill(USERNAME);
  await page.locator("#password").fill(PASSWORD);
  await page.locator("#kc-login").click();
  await page.waitForURL((url) => url.hostname.includes("adad.io") && !url.pathname.includes("/realms/"), {
    timeout: 30_000,
  });
  await page.locator("adad-frontend-layout, app-root").first().waitFor({ state: "visible" });
}

async function dump(page, root) {
  const scope = root || page;
  const radios = [];
  const radioCount = await scope.getByRole("radio").count();
  for (let i = 0; i < radioCount; i += 1) {
    const radio = scope.getByRole("radio").nth(i);
    radios.push({
      name: await radio.getAttribute("aria-label").catch(() => null),
      accessible: (await radio.evaluate((el) => el.getAttribute("aria-label") || el.labels?.[0]?.innerText || el.parentElement?.innerText || "").catch(() => "")).replace(/\s+/g, " ").trim(),
      visible: await radio.isVisible().catch(() => false),
    });
  }

  const radioLabels = await scope.locator("p-radiobutton, .p-radiobutton").evaluateAll((els) =>
    els.map((el) => ({
      text: (el.innerText || "").replace(/\s+/g, " ").trim(),
      className: (el.getAttribute("class") || "").slice(0, 120),
    })),
  );

  const placeholders = await scope.locator("input, textarea").evaluateAll((els) =>
    els
      .filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((el) => ({
        placeholder: el.getAttribute("placeholder") || "",
        type: el.getAttribute("type") || el.tagName.toLowerCase(),
        role: el.getAttribute("role") || "",
        aria: el.getAttribute("aria-label") || "",
      })),
  );

  const buttons = await scope.getByRole("button").evaluateAll((els) =>
    els
      .filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((el) => ({
        name: (el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || "").replace(/\s+/g, " ").trim(),
        aria: el.getAttribute("aria-label") || "",
        title: el.getAttribute("title") || "",
        className: (el.getAttribute("class") || "").slice(0, 160),
        icons: [...el.querySelectorAll(".pi")].map((icon) => icon.className),
      })),
  );

  const comboboxes = await scope.locator("p-dropdown, p-multiselect, [role='combobox']").evaluateAll((els) =>
    els
      .filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      })
      .map((el) => ({
        text: (el.innerText || "").replace(/\s+/g, " ").trim().slice(0, 160),
        placeholder: el.querySelector("input")?.getAttribute("placeholder") || "",
        role: el.getAttribute("role") || el.querySelector("[role='combobox']")?.getAttribute("role") || "",
        label: el.getAttribute("aria-label") || "",
      })),
  );

  const hosts = await page.evaluate(() =>
    [...document.querySelectorAll("*")]
      .map((el) => el.tagName.toLowerCase())
      .filter((tag) => tag.startsWith("adad-frontend-"))
      .filter((tag, i, all) => all.indexOf(tag) === i),
  );

  let aria = "";
  try {
    aria = await scope.ariaSnapshot({ timeout: 5_000 });
  } catch (error) {
    aria = `ariaSnapshot failed: ${error.message}`;
  }

  return { radios, radioLabels, placeholders, buttons, comboboxes, hosts, aria };
}

async function clickFilterIfPresent(page, host) {
  const root = host ? page.locator(host).first() : page;
  const extra = root.getByRole("button").filter({ has: page.locator(".pi-filter") });
  if (await extra.count()) {
    await extra.first().click({ timeout: 5_000 }).catch(() => undefined);
    await page.waitForTimeout(500);
    return true;
  }
  const css = root.locator("button.field, button:has(.pi-filter)");
  if (await css.count()) {
    await css.first().click({ timeout: 5_000 }).catch(() => undefined);
    await page.waitForTimeout(500);
    return true;
  }
  return false;
}

(async () => {
  if (!USERNAME || !PASSWORD) throw new Error("Missing AUTH_USERNAME / AUTH_PASSWORD");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await login(page);

  const results = [];
  for (const spec of PAGES) {
    const entry = { name: spec.name, path: spec.path, url: "", before: null, afterExtra: null, error: null };
    try {
      await page.goto(BASE.replace(/\/$/, "") + spec.path, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await page.waitForTimeout(1500);
      if (spec.tab) {
        await page.getByRole("button", { name: spec.tab, exact: true }).click({ timeout: 10_000 });
        await page.waitForTimeout(1200);
      }
      entry.url = page.url();
      const hostLocator = spec.host ? page.locator(spec.host.split(",")[0].trim()).first() : page.locator("body");
      const hostVisible = spec.host ? await page.locator(spec.host).first().isVisible().catch(() => false) : true;
      entry.hostVisible = hostVisible;
      const root = hostVisible ? hostLocator : page;
      entry.before = await dump(page, root);
      const clicked = await clickFilterIfPresent(page, spec.host ? spec.host.split(",")[0].trim() : null);
      entry.extraFiltersClicked = clicked;
      if (clicked) entry.afterExtra = await dump(page, root);
      console.log(`OK ${spec.name} host=${hostVisible} extra=${clicked} radios=${entry.before.radioLabels.length} placeholders=${entry.before.placeholders.length}`);
    } catch (error) {
      entry.error = String(error.message || error);
      console.log(`FAIL ${spec.name}: ${entry.error}`);
    }
    results.push(entry);
  }

  const out = path.join("reports", "locator-scan.json");
  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ scannedAt: new Date().toISOString(), results }, null, 2));
  console.log(`Wrote ${out}`);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
