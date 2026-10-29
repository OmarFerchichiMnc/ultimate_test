# ultimate-test

Playwright TypeScript suite for ADAD. Each app route has one page object under `src/pages/`. That file owns the locators and TestPoints. Specs under `tests/` are the only place tests live; they run TestPoints with `runTestPoints()`.

## Setup

```sh
cp .env.example .env
npm install
npx playwright install chromium
```

Fill `.env` with UI, API, database, and SFTP values. Use Keycloak username/password (`AUTH_USERNAME` / `AUTH_PASSWORD`), not Microsoft SSO.

Start the DB tunnel before filter tests:

```sh
./scripts/ssm-db-tunnel.sh
```

Tests then use `localhost:5554` → `db.dev.adad.internal:5432`, database `staging`, schema `QA`.

## Run

```sh
npx playwright test tests/framework          # no login
npx playwright test tests/testpoints/registry.spec.ts
npm run test:testpoints                      # registry + live TestPoint health checks
npx playwright test tests/navigation
npx playwright test tests/smoke
npx playwright test tests/filters
npx playwright test --ui
```

## Test data generation

Scenarios that upload files no longer reuse the static CSVs in `docs/test_files/`. Each run generates fresh Sale / Settlement / BankDeposit files (TypeScript port of `adad-scripts/files-generator`) with unique document numbers and PNRs, so reruns never collide with old data and every expected value comes from the uploaded data.

```ts
const data = scenarioDataset("MR-01", { strategy: "documentNumberAndFop" });
await runTestPoints(page, [
  new GenerateScenarioFiles(data),                       // writes docs/test_files/generated/<run>/
  new ExecuteUpload(data.dir, config.adadPaths.sales, data.sale.fileName),
  new FileDashboardAssertTotalTransactions(data.sale.count),
  new SaleUIFilterDocumentNumber(data.documentNumber),
]);
```

- Strategies: `documentNumberAndFop` (default rule), `cardAndApprovalCode`, `pnrReference`, `manyToMany`, `oneToMany`, `manyToOne`.
- Variants for negative cases: `amountDiscrepancy`, `duplicateTransaction`, `corruptedRecord`, `unknownFop`, `unknownOffice`, `missingMerchant`, `missingRoe`, `corruptedStructure`.
- Options: `multiCurrency`, `withRefunds`, `transactionCount`, `paymentDate`.
- Defaults (count, payment date, airline, office id, merchant id...) live under `generation:` in `src/configuration/config.yaml`; `GEN_PAYMENT_DATE`, `GEN_TRANSACTION_COUNT`, `GEN_ACCOUNTING_CURRENCY` and `GEN_OUTPUT_DIR` override them.
- Each generated folder has a `manifest.json` with the keys used. The folder is git-ignored.
- `tests/scenarios/*.spec.ts` are generated from `docs/test_scenarios/adad_test_scenarios.csv`: run `npm run scenarios:generate`. The strategy/variant for each scenario is chosen in `src/generation/scenarioProfiles.ts`.

## Layout

```
src/
  pages/                  # one .page.ts per route (locators + TestPoints)
  testpoint/TestPoint.ts
  generation/             # Sale/Settlement/BankDeposit file generator + GenerateScenarioFiles
  configuration/          # yaml + env, login, DB, SFTP
  navigation/             # URL navigation TestPoints
  fixtures/auth.ts        # worker-scoped logged-in page
tests/
  runTestPoints.ts        # shared TestPoint runner
  testpoints/             # TestPoint registry + live inspect
  smoke/
  filters/
  navigation/
  framework/
docs/test_files/          # static CSV fixtures (generated/ is created per run)
scripts/                  # crawl-buttons.js, gen-pages.js, split-scenarios.ts
```
