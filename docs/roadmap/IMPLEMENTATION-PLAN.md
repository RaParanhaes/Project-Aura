# Project AURA — Implementation Plan

This document is the operational sequence for building AURA. `ROADMAP.md` explains the phases; this file explains the order of work inside them.

Rules:
- finish the current phase before starting the next unless an accepted ADR explicitly changes the order;
- each task should be small enough to review and test independently;
- do not implement future AI layers to solve Foundation problems;
- update `docs/CURRENT.md` when the active milestone changes.

## D0 — Documentation Foundation

### D0.1 Repository map and ownership
- [x] Create initial repository folders.
- [x] Add root and module READMEs.
- [x] Add `AGENTS.md` navigation rules.

### D0.2 Project definition
- [x] Vision.
- [x] Principles.
- [x] Objectives.
- [x] Glossary.

### D0.3 Accepted architecture
- [x] Architecture overview.
- [x] Polaris ↔ AURA ↔ LLM flow.
- [x] Initial accepted ADRs.
- [x] Review central docs for contradictions/duplication.

### D0.4 Planning and research memory
- [x] Roadmap.
- [x] Implementation plan.
- [x] References catalog.
- [x] Open questions list.

### D0.5 Development rules
- [x] Development workflow.
- [x] Definition of Done.
- [x] Update documentation router and live project state.
- [x] Final documentation audit.

**D0 Done when:** a new coding agent can determine the project purpose, accepted architecture, authority order, current phase, next task and prohibited shortcuts from the repository alone.

---

## F1 — Development Foundation

### F1.1 Runtime/workspace baseline
- [x] Pin supported Node major version.
- [x] Pin pnpm through `packageManager`.
- [x] Pin TypeScript compiler version.
- [x] Add strict TypeScript base configuration.
- [x] Make existing packages/app valid workspace projects.
- [x] Prove workspace imports/typecheck across declared boundaries.
- [x] Add typecheck to `pnpm run verify` and CI.

**F1.1 validation:** GitHub Actions successfully installs the workspace and passes structure verification plus strict TypeScript checking for `aura-core` and all existing packages.

### F1.2 Test baseline
- [x] Pin Vitest test runner.
- [x] Add first unit/smoke test.
- [x] Keep test classes separated: unit, contracts, integration, scenarios, recovery and load.
- [x] Add tests to `pnpm run verify` and CI.

**F1.2 validation:** GitHub Actions successfully installs Vitest 5.0.0 and passes the first TypeScript smoke/unit test through the canonical `pnpm run verify` gate.

### F1.3 Architecture guardrails
- [x] Encode allowed/forbidden workspace dependency directions.
- [x] Validate both package manifests and source imports.
- [x] Detect circular dependencies.
- [x] Forbid deep imports and cross-workspace relative imports.
- [x] Add architecture tests and integrate them into `pnpm run verify` / CI.
- [x] Evaluate dependency-cruiser and Knip for current usefulness.

**F1.3 validation:** GitHub Actions passes repository-owned architecture verification and unit tests. `dependency-cruiser@18.2.0` is deliberately deferred because it does not support the pinned TypeScript 7.0.2; re-evaluate after TypeScript 7.1+ compatibility. Knip is deferred until the repository contains enough implementation for dead-code analysis to provide useful signal.

### F1.4 Observability baseline
- [x] Add structured logging with correlation fields.
- [x] Provide one public logger creation entry point through `@aura/observability`.
- [x] Add trace/session/agent/action/component child context.
- [x] Redact common credential fields before output.
- [x] Add focused unit tests and validate through CI.

**F1.4 validation:** GitHub Actions passes Pino 10.3.1 structured logging tests for correlation context and credential redaction. The shared TypeScript configuration keeps AURA source strict while using `skipLibCheck: true` to avoid revalidating incompatible third-party declaration internals.

### F1.5 Verification gate
- Expand `pnpm run verify` to include the checks that exist at this stage.
- Make CI run the same verification command.
- Review the final F1 Definition of Done and compatibility record.

**F1 Done when:** a minimal AURA application/package can build, typecheck and test in CI, and architecture violations are automatically detected.

---

## F2 — Protocol Foundation

### F2.1 Freeze compatibility target
- Record exact tested Polaris commit/version.
- Record exact tested Octane build/version.
- Snapshot/reference Polaris packet contracts used by AURA.

### F2.2 Study existing implementation evidence
- Inspect Polaris `packet-field-contracts.json` and relevant handlers.
- Inspect compatible portions of `cayank/packet-client`.
- Record license/reuse mode before adapting code.

### F2.3 Packet primitives
- Frame length/header handling.
- Integer fields.
- Boolean fields.
- String fields.
- Error handling for malformed/partial data.

### F2.4 Registry and contracts
- Stable packet identifiers/contracts.
- No protocol header numbers scattered outside the protocol package.
- Version/compatibility metadata.

### F2.5 Initial packets
Implement only the minimum packets required to prove a session:
- release/version handshake;
- machine identification;
- secure login/auth message;
- ping/pong/keepalive;
- minimum room transition packets needed by F3/F4.

### F2.6 Fixtures and tests
- Known byte fixtures.
- Encode/decode contract tests.
- Property-based tests for codec invariants where valuable.

**F2 Done when:** AURA can encode/decode the selected minimum Polaris protocol deterministically and prove compatibility with fixtures/contracts without any AI logic.

---

## F3 — RealSession

### F3.1 Session lifecycle model
Define explicit states such as disconnected, connecting, authenticating, online, reconnecting and failed.

### F3.2 Transport
- WebSocket connection.
- Incoming packet dispatch.
- Outgoing packet send boundary.
- Heartbeat and timeout handling.

### F3.3 Authentication boundary
- Define `AuthProvider` interface.
- Prove the actual local CMS/SSO path.
- Keep auth-specific details outside protocol/domain logic.

### F3.4 First real login
Golden proof:
- account authenticates;
- Polaris recognizes it as a normal user session;
- no browser/Octane renderer is required.

### F3.5 Disconnect/reconnect
- Detect transport loss.
- Reconnect without duplicate active sessions.
- Integrate Polaris-native resume support when available/compatible.

**F3 Done when:** one real account can repeatedly connect, authenticate, survive normal connection loss and return to a known session state.

---

## F4 — WorldState

### F4.1 Event normalization
Convert raw server packets into stable domain events.

### F4.2 Room transition/hydration
- Track entering/changing rooms.
- Build minimum room readiness barrier.
- Buffer events that cannot yet be resolved safely, such as chat before user identity mapping.

### F4.3 Core observed state
- room identity;
- users;
- room-unit ↔ user mapping;
- position/rotation/status;
- chat;
- typing.

### F4.4 State rules
- only Polaris observations update observed state;
- pending intent/action remains separate;
- maintain revision/version information useful for stale-decision detection later.

**F4 Done when:** AURA can reconstruct a coherent minimal room view from server events and expose it without raw-packet knowledge.

---

## F5 — Capabilities

Implement semantic actions one at a time:

1. `ENTER_ROOM`
2. `WALK_TO`
3. `LOOK_AT`
4. `START_TYPING`
5. `STOP_TYPING`
6. `SAY`

For every capability define:
- input schema;
- preconditions;
- Polaris adapter mapping;
- expected confirmation/observation;
- timeout/failure result;
- recovery semantics.

**F5 Done when:** the first golden scenario can be expressed entirely through semantic capabilities, not raw packet calls from agent/runtime code.

---

## F6 — Persistence & Recovery

### F6.1 Durable state boundary
- versioned AgentState;
- repository/store interface;
- no sockets/timers/live clients inside persisted state.

### F6.2 ActionJournal
Track action ID, intent, start time and outcome states such as pending, confirmed, rejected and ambiguous.

### F6.3 Checkpoints
Persist only continuity that is meaningful to restore.

### F6.4 Reconciliation
After ambiguous failure, query/observe Polaris before repeating non-idempotent actions.

### F6.5 Restart scenarios
- AURA process restart while Polaris stays online;
- Polaris restart while AURA stays online;
- both restart and agents rebuild ephemeral world state.

**F6 Done when:** agent continuity survives failures without pretending transient world state is durable truth.

---

## F7 — Multi-session

Scale in controlled steps:
- 1 session baseline;
- 4 simultaneous sessions;
- 10;
- 20;
- approximately 30.

Measure:
- connection stability;
- CPU/memory;
- event processing;
- reconnect storms;
- fairness/resource starvation;
- failure isolation.

**F7 Done when:** the same architecture supports the target resident count without one browser/renderer per resident.

---

## F8 — Foundation Validation

Required golden scenarios include:
- login → room → world ready;
- walk → observed position confirmation;
- start typing → say → stop typing;
- disconnect → reconnect;
- Polaris restart → recovery;
- two+ headless users sharing a room;
- target multi-session load.

Review:
- test coverage matrix;
- known limitations;
- compatibility record;
- architecture/documentation accuracy.

**F8 Done when:** all required Foundation scenarios pass repeatably and remaining limitations are explicitly documented.

---

## After Foundation

Do not pre-implement these during F1–F8. They will receive their own plans when the Foundation provides real evidence:
- perception/attention;
- goals/activities;
- skills/habits;
- social/group conversation engine;
- memory/knowledge/relationships;
- LLM gateway and Ollama;
- human realism;
- economy, catalog, furniture, trade and room planning.
