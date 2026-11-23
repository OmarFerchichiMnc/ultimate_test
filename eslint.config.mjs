// ESLint flat config. `npm run lint` fails on errors only; warnings flag code to clean up over time.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["node_modules/", "reports/", "playwright-report/", "test-results/", "docs/", "dist/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-require-imports": "off",
      "no-empty-pattern": "off",
      // base.extend<{}, WorkerFixtures>() is the Playwright idiom for "no test-scoped fixtures".
      "@typescript-eslint/no-empty-object-type": ["error", { allowObjectTypes: "always" }],
    },
  },
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // Specs run TestPoints, which assert inside src/: a spec without expect() is normal here.
      "playwright/expect-expect": "off",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/no-conditional-in-test": "warn",
      "playwright/no-conditional-expect": "warn",
    },
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
