# AURA Test Coverage Matrix

This is the living answer to: **what proves feature X works?**

Legend: ✅ covered · ⚠ partial · — not yet implemented · ENV requires external environment.

| Feature | Unit | Contract | Polaris Integration | Scenario | Recovery | Load |
|---|---:|---:|---:|---:|---:|---:|
| Repository / TypeScript baseline | ✅ | — | — | — | — | — |
| Test runner baseline | ✅ | — | — | — | — | — |
| Architecture guardrails | ✅ | — | — | — | — | — |
| Observability baseline | ✅ | — | — | — | — | — |
| F1 verification gate | ✅ | — | — | — | — | — |
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
- `tests/unit/architecture-guardrails.test.ts` proves accepted/forbidden workspace edges, deep-import detection and circular-dependency detection.
- `tests/unit/observability.test.ts` proves structured log correlation fields and credential redaction.
- `pnpm run architecture` validates the real repository manifests and source imports.
- `pnpm run verify` is the canonical local/CI gate and includes `doctor`, repository structure, architecture boundaries, strict type checking and unit tests.
- GitHub Actions installs from the committed dependency graph with `pnpm install --frozen-lockfile` before running the same `pnpm run verify` command.
- F1 intentionally uses strict type checking as its compile gate; emitted runtime build validation begins when an executable/package output exists.
- Coverage percentage thresholds are intentionally not introduced yet; meaningful product behavior does not exist yet to make a percentage useful.

## Planned Golden Scenarios

- `GS-001` login → room → walk → typing → chat.
- `GS-002` disconnect → reconnect/session resume.
- `GS-003` Polaris restart → AURA reconciliation.
- `GS-004` multiple real sessions share a room.
- `GS-005` AURA process restart → durable agent state restored.
