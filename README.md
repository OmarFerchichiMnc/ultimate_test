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

## Layout

```
src/
  pages/                  # one .page.ts per route (locators + TestPoints)
  testpoint/TestPoint.ts
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
docs/test_files/          # CSV fixtures
scripts/                  # crawl-buttons.js, gen-pages.js
```
