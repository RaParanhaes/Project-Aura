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
| Packet codec | ✅ | ⚠ | — | — | — | — |
| Packet registry / identity contracts | ✅ | ⚠ | — | — | — | — |
| Initial packet bodies | ✅ | ⚠ | — | — | — | — |
| Frozen packet fixtures / contracts | ✅ | ✅ | — | — | — | — |
| RealSession lifecycle model | ✅ | — | — | — | — | — |
| WebSocket transport / heartbeat | ✅ | — | — | — | — | — |
| Authentication boundary | ✅ | — | — | — | — | — |
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
- `tests/unit/protocol-primitives.test.ts` proves primitive round-trips, exact frame bytes, strict bounds/range/UTF-8 handling, fragmented input, multiple packets and remainder buffering.
- `tests/unit/packet-registry.test.ts` proves frozen compatibility metadata, direction/ownership rules, duplicate rejection, direction-scoped lookup, unknown lookup semantics and immutable identity definitions.
- `tests/unit/initial-packets.test.ts` proves exact initial composer bytes, optional room-entry fields, bodyless packets, strict authenticated/home-room parsers and malformed-body/header rejection.
- `tests/contracts/initial-packets.contract.test.ts` compares the initial composers/parsers with frozen wire fixtures and verifies every fixture header through the F2.4 registry.
- `tests/unit/real-session.test.ts` proves explicit RealSession lifecycle transitions, send gating, close/reconnect behavior and fail-closed authentication errors.
- `tests/unit/session-transport.test.ts` proves binary WebSocket message dispatch/send behavior and heartbeat ping/timeout handling with fake timers.
- `tests/unit/authentication-boundary.test.ts` proves injected credential/handshake ports and credential zeroization on success and failure.
- Packet codec contract coverage now covers the frozen initial packet fixtures; broader packet catalog coverage remains future work.
- Packet registry contract coverage now covers all initial fixture identities; broader packet catalog coverage remains future work.
- Initial packet body contract coverage now covers the frozen first-session composers/parsers; runtime integration remains unverified.
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
