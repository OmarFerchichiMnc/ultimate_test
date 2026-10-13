/**
 * One-off inspector: login, follow internal links, extract clickable elements.
 * Does not click save/delete/trigger/match/submit controls.
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.ADAD_BASE_URL || "https://qa.staging.adad.io";
const ORIGIN = new URL(BASE).origin;
const USERNAME = process.env.AUTH_USERNAME || process.env.ADAD_UI_EMAIL;
const PASSWORD = process.env.AUTH_PASSWORD || process.env.ADAD_UI_PASSWORD;

const SEED_PATHS = [
  "/dashboard",
  "/dashboard/cash-forecast",
  "/alerts",
  "/reconciliation-alerts",
  "/etl-files",
  "/failed-transactions",
  "/audit-track/sale",
  "/audit-track/settlement",
  "/pending-items",
  "/provisional-mismatched-items",
  "/installments",
  "/matched-items",
  "/matched-items/exceptions",
  "/manual-matching",
  "/settlement-disputes",
  "/accounting-journal",
  "/unaccounted-events",
  "/imbalanced-items",
  "/trial-balance",
  "/post-to-ledger",
  "/alert-type-affiliation",
  "/settings",
  "/matching-rules/settlement-reconciliation",
  "/matching-rules/bank-reconciliation",
  "/settlement-reconciliation-settings",
  "/bank-reconciliation-settings",
  "/accounting-rules",
  "/accounting-periods",
  "/chart-accounts",
  "/accounting-settings",
  "/general-settings",
  "/fee-rules",
  "/roe",
  "/fx-rate-sources",
  "/form-of-payments",
  "/point-of-sales",
  "/point-of-sales-merchant-mapping",
  "/acquirers",
  "/acquirer-merchants",
  "/sale-sources",
];

function normalizePath(href) {
  if (!href) return null;
  try {
    const url = new URL(href, ORIGIN);
    if (url.origin !== ORIGIN) return null;
    if (url.pathname.startsWith("/realms/")) return null;
    return url.pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
}

async function login(page) {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.locator("#username").waitFor({ state: "visible", timeout: 20000 });
  await page.locator("#username").fill(USERNAME);
  await page.locator("#password").fill(PASSWORD);
  await page.locator("#kc-login").click();
  await page.waitForURL(/qa\.staging\.adad\.io/, { timeout: 30000 });
  await page.locator("adad-frontend-layout, adad-frontend-sidebar, app-root").first().waitFor({ timeout: 30000 });
}

async function expandSidebar(page) {
  const toggles = page.locator("adad-frontend-sidebar a, adad-frontend-sidebar button, adad-frontend-sidebar .p-ripple");
  const count = await toggles.count();
  for (let i = 0; i < Math.min(count, 80); i += 1) {
    const el = toggles.nth(i);
    const cls = (await el.getAttribute("class")) || "";
    const text = ((await el.innerText().catch(() => "")) || "").trim();
    const href = await el.getAttribute("href");
    const looksLikeMenu = !href && (cls.includes("menuitem") || cls.includes("sidebar") || text.length > 0);
    if (!looksLikeMenu) continue;
    try {
      await el.click({ timeout: 800, trial: false });
      await page.waitForTimeout(200);
    } catch {
      // ignore
    }
  }
}

async function collectInternalHrefs(page) {
  return page.evaluate((origin) => {
    const hrefs = new Set();
    for (const a of document.querySelectorAll("a[href]")) {
      try {
        const url = new URL(a.getAttribute("href"), origin);
        if (url.origin === origin) hrefs.add(url.pathname);
      } catch {
        // ignore
      }
    }
    return [...hrefs];
  }, ORIGIN);
}

async function extractClickables(page) {
  return page.evaluate(() => {
    const destructive = /trigger|delete|remove|save|submit|confirm|match|post to|post-to|create|upload|generate|apply|yes|ok$/i;
    const isVisible = (el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };

    const nodes = [
      ...document.querySelectorAll(
        [
          "button",
          "input[type='button']",
          "input[type='submit']",
          "input[type='reset']",
          "a.p-button",
          "a[role='button']",
          "[role='button']",
          "[role='menuitem']",
          "p-button",
          "p-dropdown",
          "p-splitbutton",
          "p-menu",
          "p-overlaypanel button",
          ".p-button",
          ".p-dropdown",
          "adad-frontend-sidebar a",
          "adad-frontend-toolbar button",
          "p-calendar button",
          "p-multiselect",
          "p-checkbox",
          "p-radiobutton",
        ].join(","),
      ),
    ];

    const seen = new Set();
    const items = [];
    for (const el of nodes) {
      if (!isVisible(el)) continue;
      const tag = el.tagName.toLowerCase();
      const type = el.getAttribute("type") || tag;
      const id = el.id || "";
      const className = (el.getAttribute("class") || "").slice(0, 220);
      const aria = el.getAttribute("aria-label") || "";
      const title = el.getAttribute("title") || el.getAttribute("aria-labelledby") || "";
      const href = el.getAttribute("href") || el.getAttribute("ng-reflect-router-link") || "";
      let text = (el.innerText || el.getAttribute("value") || "").replace(/\s+/g, " ").trim();
      if (!text) {
        const icon = el.querySelector(".p-button-icon, .pi, .material-icons, .material-symbols-outlined");
        text = (icon && (icon.getAttribute("class") || "")) || "";
      }
      const name = aria || title || text || id || className.slice(0, 40);
      const key = `${tag}|${id}|${name}|${href}|${className.slice(0, 80)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const region =
        el.closest("adad-frontend-sidebar") ? "sidebar" :
        el.closest("adad-frontend-toolbar > div > div:first-child, .layout-topbar, adad-frontend-topbar, header") ? "navbar" :
        el.closest("p-dialog, p-confirmdialog, p-dynamicdialog, [role='dialog']") ? "modal" :
        el.closest("p-dropdown, p-overlaypanel, p-menu, .p-dropdown-panel") ? "dropdown" :
        "page";

      items.push({
        text: name,
        visibleText: text,
        elementType: type,
        tag,
        id,
        className,
        ariaLabel: aria,
        title,
        targetUrl: href,
        region,
        disabled: el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true",
        destructive: destructive.test(name) || destructive.test(text),
      });
    }
    return items;
  });
}

(async () => {
  if (!USERNAME || !PASSWORD) {
    throw new Error("Missing AUTH_USERNAME / AUTH_PASSWORD");
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await login(page);
  await page.waitForTimeout(1500);
  await expandSidebar(page);

  const discovered = new Set(SEED_PATHS.map((p) => p.replace(/\/$/, "") || "/"));
  for (const href of await collectInternalHrefs(page)) {
    const n = normalizePath(href);
    if (n) discovered.add(n);
  }

  const pages = [];
  const skipped = [];
  const queue = [...discovered];

  for (const pathname of queue) {
    const url = ORIGIN + pathname;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(1200);
      const current = new URL(page.url());
      if (current.origin !== ORIGIN) {
        skipped.push({ path: pathname, reason: `left origin: ${current.origin}` });
        continue;
      }
      if (current.pathname.includes("/realms/")) {
        skipped.push({ path: pathname, reason: "redirected to identity provider" });
        continue;
      }
      for (const href of await collectInternalHrefs(page)) {
        const n = normalizePath(href);
        if (n && !discovered.has(n)) {
          discovered.add(n);
          queue.push(n);
        }
      }
      const buttons = await extractClickables(page);
      pages.push({
        url: page.url(),
        path: current.pathname,
        title: await page.title(),
        buttonCount: buttons.length,
        buttons,
      });
      console.log(`OK ${current.pathname} (${buttons.length} clickables)`);
    } catch (error) {
      skipped.push({ path: pathname, reason: String(error.message || error) });
      console.log(`SKIP ${pathname}: ${error.message}`);
    }
  }

  const out = {
    crawledAt: new Date().toISOString(),
    baseUrl: BASE,
    pageCount: pages.length,
    skipped,
    pages,
  };
  const file = path.join("reports", "button-inventory.json");
  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`Wrote ${file} pages=${pages.length} skipped=${skipped.length}`);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
