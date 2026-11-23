## What

<!-- Scenario IDs (e.g. MR-07, E2E-07) or the framework change, and why. -->

## How it was tested

- [ ] `npm run verify` passes locally (typecheck, lint, format, scenario sync, framework tests)
- [ ] The UI specs I touched pass against staging: <!-- command + result, or "not run" with the reason -->

## Checklist

- [ ] New TestPoints are in the domain file of their screen (`src/testpoints/<domain>.ts`), not in a shared file
- [ ] TestPoint IDs are new and unique
- [ ] Hand-fixed a generated spec? Its `@generated` line is removed (I own it now) or I updated the CSV and regenerated
- [ ] No `.env` values, credentials or real customer data committed
- [ ] No fixed waits added (`waitForTimeout`, `wait(...)`) where a state can be polled
