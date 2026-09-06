# AURA Test Coverage Matrix

This is the living answer to: **what proves feature X works?**

Legend: ✅ covered · ⚠ partial · — not yet implemented · ENV requires external environment.

| Feature | Unit | Contract | Polaris Integration | Scenario | Recovery | Load |
|---|---:|---:|---:|---:|---:|---:|
| Repository / TypeScript baseline | ✅ | — | — | — | — | — |
| Test runner baseline | ✅ | — | — | — | — | — |
| Packet codec | — | — | — | — | — | — |
| Authentication | — | — | — | — | — | — |
| Enter room / hydration | — | — | — | — | — | — |
| Walk | — | — | — | — | — | — |
| Look / turn | — | — | — | — | — | — |
| Typing | — | — | — | — | — | — |
| Chat | — | — | — | — | — | — |
| Reconnect | — | — | — | — | — | — |
| AURA restart recovery | — | — | — | — | — | — |
| 30 sessions | — | — | — | — | — | — |

## Current test baseline

- `tests/unit/foundation.test.ts` proves Vitest can execute TypeScript tests and load the AURA application entrypoint.
- `pnpm run verify` is the canonical CI/local gate and currently includes repository structure, strict type checking and unit tests.
- Coverage percentage thresholds are intentionally not introduced yet; meaningful behavior does not exist yet to make a percentage useful.

## Planned Golden Scenarios

- `GS-001` login → room → walk → typing → chat.
- `GS-002` disconnect → reconnect/session resume.
- `GS-003` Polaris restart → AURA reconciliation.
- `GS-004` multiple real sessions share a room.
- `GS-005` AURA process restart → durable agent state restored.
