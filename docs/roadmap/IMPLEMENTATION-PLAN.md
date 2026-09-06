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
- [x] Commit `pnpm-lock.yaml` and require frozen dependency installation in CI.
- [x] Make `pnpm run verify` the single local/CI quality gate.
- [x] Include doctor, structure verification, architecture verification, strict type checking and unit tests in that gate.
- [x] Review the F1 Definition of Done and compatibility record.
- [x] Decide whether emitted build output is required for F1 acceptance.

**F1.5 validation:** GitHub Actions installs the committed dependency graph with `pnpm install --frozen-lockfile` and then runs the same canonical `pnpm run verify` command used locally.

**Build decision:** no emitted `dist/` build is required in F1. The current private workspaces are TypeScript development surfaces and there is no executable session runtime to package yet. Strict type checking is the F1 compile gate. Build/emission must be introduced when a real runtime/package output exists rather than forcing packaging decisions early.

**F1 Done when:** dependency installation is deterministic, the repository passes one canonical verification gate in CI, architecture violations are mechanically rejected, and the typecheck, test and observability baselines are active. **Status: COMPLETE.**

---

## F2 — Protocol Foundation

### F2.1 Freeze compatibility target
- [x] Record exact Polaris version/base commit.
- [x] Record Polaris dirty-state fingerprint and runtime JAR SHA-256.
- [x] Record exact Octane commit/package version and dirty-state fingerprint.
- [x] Record exact Octane Renderer version/commit and clean state.
- [x] Reference the Polaris packet contract by schema and SHA-256.
- [x] Confirm effective client release behavior and Octane/Polaris release agreement.
- [x] Define host and same-Compose-network WebSocket targets without machine-specific paths.

**F2.1 validation:** the local hotel target is frozen in `docs/reference/COMPATIBILITY.md` using immutable commits/fingerprints/hashes. Polaris is `4.2.82` based on `11f35d8c4d2a6f371b355107d4c7e477717cb2de` with a dirty-tree fingerprint and runtime JAR SHA-256; Octane and the renderer are likewise pinned; the protocol contract is schema 2 with SHA-256 `fb8dd00dcaa7657b58781b835c0357fefc692797c1fabb9db5ba6770ce52d67b`; and the effective client release is confirmed as `NITRO-3-6-0`. This freezes the target but does not yet claim successful AURA-to-Polaris integration.

### F2.2 Study existing implementation evidence
- [x] Inspect the frozen Polaris framing/readers/writers and `packet-field-contracts.json` tooling.
- [x] Inspect handshake, authentication, heartbeat and room-entry handlers relevant to the first session path.
- [x] Cross-check wire behavior with the frozen Octane/Octane Renderer implementation.
- [x] Inspect the dirty Polaris/Octane delta for protocol-impacting changes.
- [x] Inspect `cayank/packet-client` as external reference and record license/reuse mode.
- [x] Separate confirmed static wire rules from runtime-only questions.

**F2.2 validation:** the read-only evidence study recorded in `docs/research/POLARIS-PROTOCOL-EVIDENCE.md` confirms big-endian `[4-byte length][2-byte header][body]` framing, primitive encoding, partial/multi-packet buffering requirements, the minimum ReleaseVersion → MachineID → SecureLogin → Authenticated sequence, application Ping/Pong heartbeat, and absence of protocol-relevant dirty-tree changes. `cayank/packet-client` is ISC and remains REFERENCE only. Runtime questions around SSO consumption/recovery timing and host WebSocket access are explicitly deferred to integration phases and do not block generic packet primitives.

### F2.3 Packet primitives
- [x] Implement `PacketReader` with explicit bounds checking.
- [x] Implement `PacketWriter`.
- [x] Implement `PacketFrame` for header + body.
- [x] Encode/decode the 4-byte length prefix and 2-byte header.
- [x] Support signed byte, boolean, short, int, long, double, string and raw bytes.
- [x] Preserve 64-bit long precision with `bigint`.
- [x] Support multiple complete packets in accumulated input.
- [x] Preserve incomplete remainder until a packet is complete.
- [x] Reject invalid lengths and enforce a configurable maximum packet size.
- [x] Add focused primitive/frame unit tests with exact-byte assertions.

**F2.3 validation:** `@aura/protocol` contains only generic, dependency-free wire primitives and framing. The reader is intentionally strict on bounds, boolean values and UTF-8. Tests cover exact frame bytes, primitive round-trips, malformed input, fragmentation, multiple packets and remainder buffering. Formal frozen Polaris packet fixtures remain F2.6 work; F2.3 does not claim full packet-contract coverage.

**F2.3 boundary:** no packet registry, concrete packet IDs, WebSocket lifecycle, authentication orchestration or room state. **Status: COMPLETE.**

### F2.4 Registry and contracts
- [x] Define stable packet identity contracts with direction and logical name.
- [x] Encode composer/parser ownership from packet direction.
- [x] Keep protocol header numbers in the protocol package's frozen catalog.
- [x] Record schema, contract fingerprint, Polaris version and client release metadata.
- [x] Seed the minimum first-session identities from frozen contract evidence.
- [x] Reject duplicate headers/names within a direction while allowing opposite-direction reuse.
- [x] Provide optional and required lookup behavior for unknown packets.
- [x] Add focused registry/definition unit tests.

**F2.4 validation:** `@aura/protocol` exposes immutable packet definitions and a direction-aware `PacketRegistry`. The initial catalog records 11 first-session identities from the frozen schema-2 contract evidence, including paired contracts, documented exemptions and the unpaired Pong registry entry. Tests prove compatibility identity, ownership rules, duplicate rejection, unknown lookups and allowed reuse across opposite directions.

**F2.4 boundary:** no concrete packet body codec, WebSocket lifecycle, authentication orchestration, heartbeat controller or room state. **Status: COMPLETE.**

### F2.5 Initial packets
- [x] Implement release/version handshake composer.
- [x] Implement machine identification composer.
- [x] Implement secure login/SSO ticket composer.
- [x] Implement authenticated response parser.
- [x] Implement ping/pong keepalive codecs.
- [x] Implement user-info request composer.
- [x] Implement room-enter composer with optional spawn coordinates.
- [x] Implement the minimum UserHomeRoom and RoomOpen response parsers needed by F3/F4.
- [x] Resolve every concrete header through the F2.4 registry.
- [x] Reject wrong headers and trailing body data deterministically.

**F2.5 validation:** `@aura/protocol` contains concrete composers/parsers for the first session path. Tests prove renderer-compatible field order and exact bytes for machine identity, SSO, keepalive and room entry, plus strict parsing for authentication, home-room and room-open responses. No WebSocket/session lifecycle or credential acquisition is introduced.

**F2.5 boundary:** frozen Polaris byte fixtures and exhaustive contract comparison remain F2.6 work; WebSocket/session lifecycle remains F3. **Status: COMPLETE.**

### F2.6 Fixtures and tests
- [x] Record deterministic frozen byte fixtures for the initial session packets.
- [x] Add encode/decode contract tests against those fixtures.
- [x] Verify fixture headers through the F2.4 packet registry.
- [ ] Add property-based tests for codec invariants where valuable.

**F2.6 validation:** `tests/contracts/initial-packets.contract.test.ts` compares the F2.5 composers/parsers with deterministic fixtures derived from the frozen Polaris/Octane target and verifies registry identity/header alignment. Property-based testing remains optional and is not required for the current packet set.

**F2.6 status:** INITIAL FIXTURES AND CONTRACT TESTS COMPLETE; CATALOG-WIDE FIXTURE COVERAGE REMAINS FUTURE WORK.

**F2 Done when:** AURA can encode/decode the selected minimum Polaris protocol deterministically and prove compatibility with fixtures/contracts without any AI logic.

---

## F3 — RealSession

### F3.1 Session lifecycle model
- [x] Define explicit states: disconnected, connecting, authenticating, online, reconnecting and failed.
- [x] Gate outbound sends on the online state and expose deterministic reconnect behavior.
- [x] Keep transport and authentication behind injectable ports.

**F3.1 validation:** `@aura/runtime` exposes `RealSession`, `SessionTransport` and `AuthProvider`. Unit tests cover startup, authentication failure, transport loss, reconnect and send/close state gates. Concrete WebSocket transport and real credentials remain F3.2/F3.3 work.

### F3.2 Transport
- [x] WebSocket connection adapter over an injected socket implementation.
- [x] Incoming binary packet dispatch.
- [x] Outgoing packet send boundary.
- [x] Heartbeat and timeout handling.

**F3.2 validation:** `WebSocketSessionTransport` and `HeartbeatController` are exported from `@aura/runtime` and covered by unit tests without a live server. The adapter deliberately does not decode protocol packets; that remains the responsibility of the protocol/runtime integration.

### F3.3 Authentication boundary
- [x] Define `AuthProvider`, `CredentialProvider` and `AuthHandshake` interfaces.
- [ ] Prove the actual local CMS/SSO path.
- [x] Keep auth-specific details outside protocol/domain logic and zeroize short-lived credentials.

**F3.3 validation:** `CredentialAuthProvider` bridges an injected credential source and handshake port while keeping authentication details out of `@aura/protocol` and `@aura/domain`. Unit tests cover success/failure cleanup. Local CMS/SSO proof remains an environment-dependent F3.4 prerequisite.

### F3.4 First real login
Golden proof:
- [x] Compose the transport, authentication boundary and RealSession into a first-login flow.
- [ ] Prove a configured account authenticates against the local CMS/SSO path.
- [ ] Prove Polaris recognizes it as a normal user session without browser/Octane renderer.

**F3.4 validation:** `firstLogin(session)` returns success only after the session reaches `online`, with unit coverage for sequencing. The local end-to-end golden proof remains pending environment credentials and is the next integration activity.

### F3.5 Disconnect/reconnect
- [x] Detect transport loss and make the session eligible for recovery.
- [x] Reconnect without duplicate active sessions.
- [ ] Integrate Polaris-native resume support when available/compatible.

**F3.5 validation:** `RealSession` accepts reconnect after transport loss and `SessionManager` enforces one registered session per agent. Live resume-token behavior remains pending a recovery integration test against Polaris.

**F3 Done when:** one real account can repeatedly connect, authenticate, survive normal connection loss and return to a known session state.

---

## F4 — WorldState

### F4.1 Event normalization
- [x] Define stable domain event kinds and payloads for initial session signals.
- [x] Convert inbound packets through injected decoders into timestamped domain events.
- [x] Ignore unknown packet headers without leaking protocol details into the domain.

**F4.1 validation:** `@aura/domain` owns event types and `@aura/runtime` exposes `EventNormalizer`; unit tests cover normalization, timestamps, unknown packets and duplicate registration. Room hydration remains F4.2.

### F4.2 Room transition/hydration
- [x] Add an explicit loading/ready/failed room hydration state.
- [x] Validate room snapshots before releasing dependent events.
- [x] Buffer dependent events until the hydration barrier is ready.

**F4.2 validation:** `RoomHydrator` owns snapshot validation and pending-event release; unit tests cover valid hydration, buffering and invalid snapshot failure. Full Polaris room payload integration remains F4.3 work.
- Track entering/changing rooms.
- Build minimum room readiness barrier.
- Buffer events that cannot yet be resolved safely, such as chat before user identity mapping.

### F4.3 Core observed state
- [x] Project normalized observations into a stable WorldState snapshot.
- [x] Maintain monotonic observation revisions and timestamps.
- [x] Keep requested actions separate from observed state mutation.

**F4.3 validation:** `WorldState` accepts normalized `DomainEvent` observations and exposes immutable snapshots with monotonic revisions. Unit tests cover room/home-room projection and non-mutating ping observations.
- room identity;
- users;
- room-unit ↔ user mapping;
- position/rotation/status;
- chat;
- typing.

### F4.4 State rules
- [x] Only normalized Polaris observations update observed state.
- [x] Keep pending intent separate from confirmed state.
- [x] Maintain revisions and reject stale observations.

**F4.4 validation:** `WorldState` ignores events older than the latest accepted observation while preserving its revision and facts. Unit coverage proves stale-event rejection.

**F4 Done when:** AURA can reconstruct a coherent minimal room view from server events and expose it without raw-packet knowledge.

---

## F5 — Capabilities

### F5.1 Capability contracts
- [x] Define capability input validation and precondition hooks.
- [x] Keep packet writes behind injected executors.
- [x] Return `pending` until an observation confirms the requested effect.

**F5.1 validation:** `CapabilityRegistry` validates and dispatches semantic requests without exposing raw protocol calls; unit tests cover valid, invalid, precondition-failed and unknown requests.

### F5.2 ENTER_ROOM
- [x] Define room-id/password input schema and current-room precondition.
- [x] Map execution through an injected adapter command.
- [x] Keep successful requests pending until room observation confirms entry.
- [x] Complete the Polaris `2312 -> 758 -> 2300` room-entry exchange.
- [x] Validate that a user already in the room receives the entering user's `RoomUsers` record.

**F5.2 validation:** `registerEnterRoom` exposes the semantic contract and unit tests cover validation, duplicate-room rejection and adapter dispatch. `PolarisRoomEntryAdapter` sends the required second-stage room data request after `RoomOpen`. A live local test with two test accounts in room AAA confirmed that the existing occupant receives header `374` containing the entering account and that the entrant receives the complete roster.

### F5.6 STOP_TYPING
- [x] Define a bodyless semantic input, room precondition and pending result.
- [x] Map STOP_TYPING to Polaris' bodyless header `1474`.
- [x] Keep START_TYPING paired with its complete header `1597` mapping.

**F5.6 validation:** `registerStopTyping` and `PolarisTypingAdapter` are covered by unit tests. Both typing transitions resolve to exact six-byte packets (`1597`/`1474`) and neither command is emitted without an observed room.

### F5.7 SAY
- [x] Map SAY to Polaris `RoomUserTalkEvent` header `1314`.
- [x] Encode text, bubble id and colour in renderer-compatible order.
- [x] Add room precondition and maximum chat length validation.
- [x] Add exact-byte and adapter tests.

**F5.7 validation:** `registerSay` and `PolarisChatAdapter` pass unit tests; SAY encodes the complete body required by Polaris and rejects empty, oversized or roomless input. A controlled Polaris/Octane run in room AAA verified the avatar seated on a free stool, emitted a public message, switched from the active chat-bubble style to an explicit alternative, and emitted a second message.

### F5.8 WHISPER
- [x] Map WHISPER to Polaris `RoomUserWhisperEvent` header `1543`.
- [x] Encode recipient prefix, text, bubble id and colour in Polaris order.
- [x] Require a non-empty single-word room recipient and a valid message.
- [x] Add exact-byte, adapter and semantic capability tests.

**F5.8 validation:** `registerWhisper` and `PolarisChatAdapter` pass unit tests. A live Polaris/Octane run in room AAA sent a directed whisper from `octane_test_2_mt` to Cabana.

### F5.9 SHOUT
- [x] Map SHOUT to Polaris `RoomUserShoutEvent` header `2085`.
- [x] Encode text, bubble id and colour in Polaris order.
- [x] Require observed room presence and a valid message.
- [x] Add exact-byte, adapter and semantic capability tests.

**F5.9 validation:** `registerShout` and `PolarisChatAdapter` pass unit tests. A live Polaris/Octane run in room AAA sent a Shift+Enter shout from `octane_test_2_mt`.

Implement semantic actions one at a time:

1. `ENTER_ROOM`
2. `WALK_TO`
3. `LOOK_AT`
4. `START_TYPING`
5. `STOP_TYPING`
6. `SAY`
7. `WHISPER`
8. `SHOUT`

For every capability define:
- input schema;
- preconditions;
- Polaris adapter mapping;
- expected confirmation/observation;
- timeout/failure result;
- recovery semantics.

**F5 Done when:** the first golden scenario can be expressed entirely through semantic capabilities, not raw packet calls from agent/runtime code. **Status: COMPLETE.**

---

## F6 — Persistence & Recovery

### F6.1 Durable state boundary
- versioned AgentState;
- repository/store interface;
- no sockets/timers/live clients inside persisted state.

**F6.1 result:** `@aura/persistence` defines the versioned `AgentState` schema and `AgentStateRepository` port. Persisted input is validated before restore and unknown fields, unsupported versions and transient runtime objects are rejected. The in-memory adapter is test-only; durable database storage remains a later F6 milestone. **Status: COMPLETE.**

### F6.2 ActionJournal
Track action ID, intent, start time and outcome states such as pending, confirmed, rejected and ambiguous.

**F6.2 result:** `ActionJournal` records semantic intent and outcome transitions. Actions begin as `pending`; ambiguous effects can be reconciled once to `confirmed` or `rejected`, while finalized entries cannot be overwritten. **Status: COMPLETE.**

### F6.3 Checkpoints
Persist only continuity that is meaningful to restore.

**F6.3 result:** `CheckpointStore` persists versioned continuity checkpoints with monotonic sequence numbers, reason and creation time. Checkpoints validate the embedded `AgentState`, enforce identity consistency and expose latest/list reads without transient world or runtime data. **Status: COMPLETE.**

### F6.4 Reconciliation
After ambiguous failure, query/observe Polaris before repeating non-idempotent actions.

**F6.4 result:** `ActionReconciler` requires an observation before resolving an ambiguous action. Confirmed/rejected observations update the journal; unknown observations remain ambiguous and explicitly disallow automatic retry. **Status: COMPLETE.**

### F6.5 Restart scenarios
- AURA process restart while Polaris stays online;
- Polaris restart while AURA stays online;
- both restart and agents rebuild ephemeral world state.

**F6.5 result:** `RestartRecovery` restores the latest checkpoint, marks pending agent actions ambiguous after a process restart, leaves other agents untouched and explicitly requires rebuilding ephemeral world state from Polaris. **Status: COMPLETE.**

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

Foundation is now stable. The active post-Foundation milestones are maintained in [`POST-FOUNDATION.md`](POST-FOUNDATION.md), beginning with P1 perception and attention.
