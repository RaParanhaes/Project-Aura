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
| First-login flow | ✅ | — | — | — | — | — |
| Disconnect/reconnect coordination | ✅ | — | ✅ | — | ✅ | — |
| Event normalization | ✅ | — | — | — | — | — |
| Room hydration barrier | ✅ | — | — | — | — | — |
| Observed WorldState | ✅ | — | — | — | — | — |
| WorldState stale-event rules | ✅ | — | — | — | — | — |
| Capability contracts | ✅ | — | — | — | — | — |
| ENTER_ROOM capability | ✅ | ✅ | ENV ✅ | — | — | — |
| STOP_TYPING capability | ✅ | ✅ | — | — | — | — |
| SAY capability and chat packet | ✅ | ✅ | ✅ | — | — | — |
| WHISPER capability and chat packet | ✅ | ✅ | ✅ | — | — | — |
| SHOUT capability and chat packet | ✅ | ✅ | ✅ | — | — | — |
| Authentication | — | — | — | — | — | — |
| Enter room / hydration | — | — | — | — | — | — |
| Walk | ✅ | ✅ | ✅ | ⚠ | — | — |
| Look / turn | — | — | — | — | — | — |
| Typing | — | — | — | — | — | — |
| Chat | — | — | — | — | — | — |
| Reconnect | ✅ | ✅ | ✅ | — | ✅ | — |
| AURA restart recovery | ✅ | — | ✅ | ✅ | ✅ | — |
| 20 sessions | — | — | ✅ | — | — | ✅ |
| 30 sessions | — | — | — | — | — | ⚠ deferred |
| Primary golden scenario | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Resident-relative perception filter | ✅ | — | — | — | — | — |
| Deterministic attention ranking | ✅ | — | — | — | — | — |

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
- `tests/unit/first-login.test.ts` proves the composed first-login flow reaches `online` only after transport and authentication complete.
- `tests/unit/session-manager.test.ts` proves duplicate active sessions are rejected and cleanup permits recovery.
- `tests/unit/event-normalizer.test.ts` proves registered packet normalization, observation timestamps, unknown-packet handling and duplicate decoder rejection.
- `tests/unit/room-hydrator.test.ts` proves event buffering, snapshot validation and ready/failed hydration transitions.
- `tests/unit/world-state.test.ts` proves observed-event projection, monotonic revisions and preservation of room facts across ping events.
- `tests/unit/world-state.test.ts` also proves stale observations are ignored without revision regression.
- `tests/unit/capability-registry.test.ts` proves semantic input validation, preconditions, unknown-capability rejection and pending execution results.
- `tests/unit/enter-room.test.ts` proves ENTER_ROOM validation, current-room rejection and adapter dispatch.
- `tests/unit/polaris-room-entry.test.ts` proves that room entry sends 2312, consumes 758 once and sends the required bodyless 2300 request before Polaris roster hydration.
- `tests/unit/stop-typing.test.ts` proves STOP_TYPING validation, room precondition and pending command dispatch.
- `tests/unit/say.test.ts` proves SAY validation, room precondition and pending command dispatch.
- `tests/unit/polaris-chat.test.ts` proves the exact RoomUserTalk packet bytes.
- A controlled live run in room AAA proves public chat and an explicit non-active bubble-style selection in the existing renderer.
- `tests/unit/whisper.test.ts` proves recipient/message validation, room precondition and pending command dispatch; a live room AAA run proves the directed renderer flow.
- `tests/unit/shout.test.ts` proves shout validation and room precondition; a live room AAA run proves the renderer flow.
- `tests/unit/polaris-typing.test.ts` proves both typing transitions emit complete bodyless Polaris packets (1597 and 1474).
- Local Polaris validation with two test accounts proved that an existing room occupant receives header 374 for the account entering afterwards; this environment check is repeatable but is not part of the hermetic CI suite.
- A live four-session Polaris run with `aura_f7_1` through `aura_f7_4` authenticated concurrently, entered room AAA and confirmed that every session received a roster containing all four F7 identities. The accounts and password are stored only in the local protected test-credentials file; tickets were process-only.
- A live ten-session Polaris run with `aura_f7_1` through `aura_f7_10` authenticated concurrently, entered room AAA and confirmed that every session received a roster containing all ten F7 identities. The observed roster also included the three pre-existing room occupants.
- A live twenty-session Polaris run with `aura_f7_1` through `aura_f7_20` authenticated concurrently, entered AAA after a temporary capacity increase and confirmed that every session received a roster containing all twenty identities. The AAA capacity was restored to 10 and Polaris restarted after the run. A post-run sample measured Polaris at 363.7 MiB, CMS at 12.78 MiB and MariaDB at 85.76 MiB.
- The executable `@aura/core` composition authenticated `Ana_libras` against the local CMS/Polaris stack twice with fresh process-only SSO tickets, stayed online for approximately 12 seconds per run and disconnected cleanly. The second run restored checkpoint sequence 1 from `AURA_STATE_PATH` and saved sequence 2. The test file contained two validated records and no credentials.
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
