# Tests

AURA tests are organized by what they prove, not by implementation package.

- `unit/` — isolated behavior
- `contracts/` — packet/schema/compatibility contracts
- `integration/` — AURA with real or controlled external boundaries
- `scenarios/` — user-visible Golden Scenarios
- `recovery/` — reconnect, restart and ambiguous-action recovery
- `load/` — multi-session and performance validation

See `docs/engineering/TEST-COVERAGE.md` for the coverage matrix.
