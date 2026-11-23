# Contributing

Several people push to this repo. These rules keep pull requests small, reviewable and free of conflicts.

## Workflow

1. Branch from an up-to-date `main`: `git switch main && git pull && git switch -c <type>/<short-name>`.
   Types: `feature/` (new tests), `fix/`, `chore/` (tooling), `refactor/`.
2. Keep one scenario or one change per branch.
3. Before pushing, run `npm run verify`. It is what CI runs: typecheck, lint, formatting, scenario sync, framework tests.
   Run `npm run format` and `npm run lint:fix` to fix most findings.
4. Open a pull request into `main` and fill in the template. CI must be green and a code owner must approve.
5. Squash-merge, then delete the branch.

## Where code goes

| You are adding                       | Put it in                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Locators or actions for a screen     | `src/pages/<screen>.page.ts`                                                                                                         |
| A scenario TestPoint                 | `src/testpoints/<domain>.ts`, the file of its screen. A new domain file also needs one `export *` line in `src/testpoints/index.ts`. |
| Helpers shared by several TestPoints | `src/testpoints/helpers.ts` or `src/pages/scenarioSupport.ts`                                                                        |
| Test data rules                      | `src/generation/`                                                                                                                    |
| A scenario spec                      | Add or change it in `docs/test_scenarios/adad_test_scenarios.csv`, then `npm run scenarios:generate`                                 |

Never put new TestPoints back in one shared file: that is what made everyone edit the same 56 KB file.

## Generated scenario specs

`tests/scenarios/*.spec.ts` are written by `npm run scenarios:generate` from the CSV. Each one starts with an `@generated` line that holds a checksum of the file.

- The generator only rewrites a spec that nobody has changed since it was generated.
- If you edit a generated spec by hand, the checksum no longer matches and the generator skips it from then on, and says so.
- To take a spec over for good, delete its `@generated` line. The generator never touches it again.
- `npm run scenarios:generate -- --force` overwrites everything, hand edits included. Only use it on purpose.
- CI runs `npm run scenarios:check`: it fails when the CSV changed but the untouched specs were not regenerated.
- Prettier skips these files, so formatting never breaks the checksum.

## Style

Prettier formats the code (120 columns, double quotes, trailing commas) and ESLint checks it. Lint warnings do not fail CI; errors do. Use the Prettier and ESLint extensions with format-on-save.

## Running against staging

UI suites need `.env`, the tunnels and a login (see the README). CI cannot reach staging, so state in the pull request which UI specs you ran and their result. Generated data is unique per run, so two people can run scenarios at the same time.

Never commit `.env`, credentials or real customer data.
