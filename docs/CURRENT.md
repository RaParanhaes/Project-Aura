# Current Project State

**Completed phases:** D0 — Documentation Foundation; F1 — Development Foundation; F5 — Capabilities  
**Current phase:** P1 — Perception and Attention
**Last completed milestone:** P1.1 — Resident-relative perception
**Next milestone:** P1.2 — Deterministic attention ranking
**Status:** FOUNDATION STABLE; P1 IN PROGRESS
**Implementation status:** F3/F4 COMPLETE; F5 COMPLETE; F6 COMPLETE; F7 COMPLETE; F8 COMPLETE; P1.1 COMPLETE

## F6.1 result — durable state boundary

`@aura/persistence` now defines the versioned `AgentState` schema and the `AgentStateRepository` storage port. `parseAgentState` validates untrusted persisted data before restoration, rejects unsupported versions and unknown fields, and limits the state to stable identity, objective, room references and update time. `InMemoryAgentStateRepository` provides a deterministic adapter for tests and clones values at the boundary.

Sockets, timers, live clients and transient room rosters are intentionally excluded from the durable schema. The production database adapter remains a later F6 concern.

The executable `aura-core` composition was live-validated against the local CMS/Polaris stack with `Ana_libras`: SSO login succeeded, the session remained online for approximately 30 seconds and disconnected cleanly. `FileCheckpointStore` is now wired into the executable through `AURA_STATE_PATH`; two independent authenticated runs restored sequence 1 and saved sequence 2 in the second process. The file-backed adapter validates records and uses atomic replacement writes.

## F7.1 result — session fleet baseline

`@aura/runtime` now exposes `SessionFleet` over `SessionManager`. It starts resident sessions concurrently, enforces unique identities and a configurable capacity (30 by default), isolates authentication failures to the affected resident and stops all managed sessions together. The four-session hermetic baseline passed with three successful sessions and one deliberate authentication failure; the three healthy sessions remained online and were shut down cleanly.

## F7.2 result — four-session live baseline

Four newly registered CMS identities (`aura_f7_1` through `aura_f7_4`) authenticated concurrently against the local CMS, connected to Polaris, entered room AAA (room ID 1) and remained visible in the shared `RoomUsers` roster. Each session observed all four F7 identities alongside the existing room occupants. The test used fresh process-only SSO tickets and disconnected all four sessions after the observation window. Movement and seating remain a separate protocol task.

## F7.3 result — ten-session headless baseline

Six additional local CMS identities (`aura_f7_5` through `aura_f7_10`) were registered with the protected F7 test credentials. Ten fresh SSO tickets were consumed concurrently; all ten sessions authenticated, entered AAA and observed a roster containing all ten F7 identities. The run completed without cross-session failures and disconnected the sessions after the observation window. Movement and seating remain outside this baseline.

## F7.4 result — twenty-session stability and resource baseline

Ten additional local CMS identities (`aura_f7_11` through `aura_f7_20`) were registered for the target-scale test. After temporarily raising AAA capacity and restarting Polaris to reload it, twenty fresh sessions authenticated concurrently, entered AAA and each observed all twenty F7 identities. The post-run sample was Polaris 363.7 MiB, CMS 12.78 MiB and MariaDB 85.76 MiB. The original AAA capacity of 10 was restored in the database and Polaris was restarted again; no permanent emulator configuration change remains.

## F7 completion

The user-authorized thirty-session run was intentionally skipped. The architecture was validated through twenty concurrent real sessions, with bounded capacity of 30 in `SessionFleet`; the remaining F7.5 target run is documented as deferred rather than assumed.

## F8.1 result — golden scenario audit

The foundation audit is now active. Authentication, room entry/roster visibility, typing, chat, persistence/restart, reconnect and multi-session scenarios have repeatable evidence. The complete golden scenario and final documentation/coverage audit remain before the F8 completion gate.

## F8.2 result — WALK_TO wire validation

`@aura/protocol` now exposes the renderer-compatible `UNIT_WALK` composer (header 3320, integer `x,y`) and a strict `UNIT_STATUS` parser (header 1640) for movement/posture observations. `PolarisWalkAdapter` sends the composer through the normal packet adapter boundary. A live AAA test moved `aura_f7_1` from `(3,5)` to `(4,5)` and observed the matching `mv 4,5,0.0` status from Polaris.

## F8.3 result — reconnect and session recovery

The aura-core handshake now keeps the short-lived Polaris recovery token in memory and includes it on the next SSO handshake. The token is never written to checkpoints, logs or the repository; it is cleared with the process. `SessionRecoveryTokenStore` has focused unit coverage.

A live test with `aura_f7_1` against the local CMS/Polaris stack authenticated, entered room AAA, closed the WebSocket and reconnected after one second. Polaris returned `sessionResumed=true` with `roomId=1`, confirming recovery of the same authenticated room session. The test required the local Polaris setting `session.recovery.enabled=1`; it was restored to `0` and Polaris was restarted after validation.

## F8.4 result — Polaris restart reconciliation

A controlled container restart was exercised with `aura_f7_1` active in AAA and a valid recovery token. Polaris checkpointed the active authentication, consumed the one-time recovery token after startup and now reports the controlled recovery as `sessionResumed=true`. Because a restarted emulator has no surviving in-memory room instance, it correctly reports `roomId=0`; AURA then performs the normal room-entry handshake and returns to AAA.

The local Polaris response was corrected to distinguish controlled restart recovery from a new login without treating transient room state as durable. Focused Java 25 tests passed, the local image was rebuilt, and the end-to-end scenario passed against the replacement container. `session.recovery.enabled` was restored to `0` after validation.

## F8.5 result — complete golden scenario

The repeatable golden run used two real AURA identities in AAA. `aura_f7_1` authenticated, observed `aura_f7_2` in the shared roster, sent START_TYPING, SAY and STOP_TYPING, sent WALK to the adjacent tile, disconnected and reconnected with `sessionResumed=true` while remaining in room 1. The movement confirmation path was already live-validated in F8.2; the combined run exercised the same packet adapters and recovery handshake in one resident flow.

The F8 requirements now have repeatable evidence for authentication, room hydration and shared presence, movement confirmation, typing/chat, persistence, reconnect, controlled Polaris restart recovery and twenty-session load. The Foundation completion gate is satisfied; future cognition layers remain outside F8.

## P1.1 result — resident-relative perception

`@aura/runtime` now projects a bounded perception from the Polaris-confirmed `WorldStateSnapshot`. The filter resolves the resident by user id, limits visible units by tile radius and capacity, orders candidates deterministically and retains the originating world revision. It returns no nearby units until both room and self-roster context are confirmed.

The post-Foundation sequence is defined in `docs/roadmap/POST-FOUNDATION.md`. P1 remains deterministic and provider-independent; Ollama is not required for perception or attention.

### Visual validation note

The golden run intentionally used chat bubble id `1`, which Polaris defines as the `ALERT` bubble; the exclamation icon above the text is therefore expected. Ordinary resident speech should use bubble id `0`. The looks for `aura_f7_1`, `aura_f7_2` and `Cabana` remain unchanged in the database; short appearance changes observed while walking or leaving are client-side movement/removal animation effects, not persisted look changes.

## F1 result

The repository has the minimum development foundation required to implement protocol work safely:

- Node.js 24.x and pnpm 11.25.0;
- committed frozen dependency graph;
- TypeScript 7.0.2 strict workspace baseline;
- Vitest 5.0.0 unit/smoke baseline;
- repository-owned architecture guards;
- Pino 10.3.1 structured logging foundation;
- one canonical `pnpm run verify` local/CI gate.

## F2.1 result — compatibility target frozen

The exact local hotel environment used as the reference for AURA protocol work is frozen in `reference/COMPATIBILITY.md`.

Key identity:

- Polaris `4.2.82`, base commit `11f35d8c4d2a6f371b355107d4c7e477717cb2de`, with recorded dirty-state fingerprint and runtime JAR SHA-256;
- Octane base commit `80f105adb8786093a194d7f10cb1517ec580b0f1`, with recorded dirty-state fingerprint;
- Octane Renderer `2.1.0`, commit `88dade32f88285fe3ff1d30387841ea66f15acf1`;
- Polaris packet contract schema `2`, SHA-256 `fb8dd00dcaa7657b58781b835c0357fefc692797c1fabb9db5ba6770ce52d67b`;
- effective client release `NITRO-3-6-0`;
- Polaris internal WebSocket port `2096`.

The frozen target is evidence for protocol implementation, not a claim that AURA has already connected successfully.

## F2.2 result — protocol evidence confirmed

A read-only study of the frozen Polaris, Octane and Octane Renderer implementation established the wire rules needed for primitive codec work.

Confirmed:

- binary, big-endian framing;
- packet format `[4-byte length][2-byte header][body]`;
- length covers header + body, excluding the 4-byte length prefix;
- byte/boolean/short/int/long/double/string encoding rules;
- UTF-8 strings with unsigned 16-bit byte length;
- incomplete byte streams must be buffered;
- multiple packets may be decoded from accumulated bytes;
- AURA must not assume one WebSocket message equals one packet;
- active frozen target has no normal payload compression/encryption;
- connection sequence is ReleaseVersion → MachineID → SecureLogin → Authenticated → initial state → application Ping/Pong;
- primary heartbeat uses S→C `PingComposer` header `3928` and C→S `PongMessageComposer` header `2596`;
- current Polaris/Octane dirty changes do not affect framing, packet IDs, handshake, authentication, heartbeat, room entry or packet contracts;
- `cayank/packet-client` is ISC-licensed and remains REFERENCE only.

Authoritative evidence summary: `research/POLARIS-PROTOCOL-EVIDENCE.md`.

## F2.3 result — packet primitives implemented

`@aura/protocol` now exposes a dependency-free generic wire layer:

- `PacketReader` with strict bounds checking;
- `PacketWriter` with explicit numeric range checks;
- signed byte/short/int/long handling, with `bigint` for 64-bit long values;
- IEEE-754 double support;
- strict UTF-8 strings with unsigned 16-bit byte lengths;
- `PacketFrame` plus deterministic frame encoding;
- incremental `PacketStreamCodec` that buffers incomplete input and emits multiple complete packets;
- configurable maximum packet length, with the frozen-target default currently set to `417792` bytes;
- typed errors for bounds, invalid lengths, oversized packets, invalid values and oversized strings.

The AURA reader is intentionally stricter than permissive fallback paths found in Polaris: malformed/truncated primitives, invalid boolean wire values and malformed UTF-8 fail explicitly instead of being silently truncated.

Focused tests cover exact wire bytes, primitive round-trips, signed ranges, long precision, UTF-8 byte lengths, malformed UTF-8, fragmented packets, multiple packets, remainder buffering and invalid/oversized lengths.

No packet registry, concrete Polaris packet class, WebSocket/session lifecycle, authentication orchestration, reconnect or heartbeat controller was introduced.

## F2.4 result — registry and contracts implemented

`@aura/protocol` now exposes a direction-aware identity layer on top of the wire primitives:

- stable packet definitions with direction, header, logical name and composer/parser ownership;
- compatibility metadata for Polaris `4.2.82`, client release `NITRO-3-6-0` and the schema-2 contract fingerprint;
- an immutable initial catalog containing the identities needed by the first session path;
- direction-scoped lookup by header or logical name;
- optional and required lookup semantics for unknown packets;
- explicit rejection of duplicate headers and names within one direction;
- support for the same header or logical name in opposite directions;
- contract status metadata distinguishing paired contracts, exemptions and unpaired evidence.

The registry contains identity metadata only. It does not encode/decode concrete packet bodies and has no WebSocket, authentication or session lifecycle behavior.

Focused tests cover compatibility identity, definition validation, direction/ownership rules, duplicate detection, unknown lookups, opposite-direction semantics and immutable metadata.

## F2.5 result — initial packet bodies implemented

`@aura/protocol` now exposes concrete codecs for the first session path:

- ClientHello/release version;
- machine identification;
- SSO ticket/secure login;
- authenticated response;
- application Ping/Pong keepalive;
- user-info request;
- room enter with optional spawn coordinates and the required post-`RoomOpen` room-data request;
- UserHomeRoom and RoomOpen response parsing.

All codecs resolve their headers through the frozen registry and fail on wrong headers or trailing body bytes. Body codecs remain independent of WebSocket/session lifecycle and authentication credential acquisition.

Focused tests cover exact bytes, optional fields, bodyless packets, strict parser fields, room-id normalization, wrong headers and trailing data.

## F2.6 result — fixtures and contract tests implemented

`tests/contracts/initial-packets.contract.test.ts` now compares the initial packet composers/parsers with deterministic frozen-target byte fixtures and checks that fixture headers resolve to the F2.4 registry identities. The fixtures contain no credentials and use only stable test values.

The initial F2 packet surface is now complete. Runtime WebSocket transport, authentication credential acquisition, heartbeat orchestration, reconnect and recovery remain F3 work.

## F3.1 result — session lifecycle model

`@aura/runtime` now exposes `RealSession` with explicit `disconnected`, `connecting`, `authenticating`, `online`, `reconnecting` and `failed` states. The session owns lifecycle transitions, gates outbound sends on `online`, forwards inbound payloads through a callback, records startup failures and supports deterministic reconnect attempts. `SessionTransport` and `AuthProvider` are ports; no concrete WebSocket or credential acquisition is included yet.

Focused unit tests cover startup/authentication transitions, send/close gating, unexpected transport close and recovery, and fail-closed authentication errors.

## Do not start early

- Concrete WebSocket/session transport before F3.2;
- WorldState implementation (F4);
- Capabilities (F5);
- Persistence/recovery implementation (F6);
- Ollama, memory and social systems.

## F3.3 result — authentication boundary

`@aura/runtime` now exposes `CredentialProvider`, `AuthHandshake` and `CredentialAuthProvider`. Credential acquisition and handshake completion are injected ports, keeping CMS/SSO details outside protocol and domain packages. Credentials are short-lived byte material and are zeroized after the handshake succeeds or fails. A real local CMS/SSO proof still requires the configured hotel environment and test account.

## F3.4 result — first-login flow

`firstLogin(session)` now composes the transport, authentication boundary and `RealSession`, returning success only after the session reaches `online`. Unit coverage proves transport readiness precedes authentication and that the result exposes the agent identity. End-to-end proof against the local hotel remains pending a configured account and CMS/SSO endpoint.

## F3.5 result — disconnect/reconnect coordination

`RealSession` accepts recovery after an unexpected transport close, and `SessionManager` enforces at most one registered session per agent identity. Unit coverage proves duplicate-session rejection, cleanup and reconnect eligibility. Live reconnect/resume behavior remains environment-dependent.

## F4.1 result — event normalization

`@aura/domain` defines stable event kinds and payloads for session and initial room signals. `@aura/runtime` exposes `EventNormalizer`, which maps packet headers through injected decoders, stamps observation time and ignores unknown packets without coupling domain code to protocol details.

## F4.2 result — room hydration barrier

`RoomHydrator` tracks idle/loading/ready/failed states, validates room snapshots and buffers dependent domain events until a valid snapshot is accepted. Hydration failures retain the failed state and do not release buffered events.

## F4.3 result — observed WorldState

`WorldState` projects only normalized domain observations, increments a monotonic revision for each event and tracks observed room/home-room context. Pings advance observation time without changing room facts; no requested action can mutate the projection.

## F4.4 result — state rules

`WorldState` discards observations older than the latest accepted timestamp, preserving its revision and room facts.

## F5.1 result — capability contracts

`CapabilityRegistry` validates semantic inputs and preconditions, invokes an injected executor and always reports accepted execution as `pending` until Polaris observations confirm the effect. Unknown capabilities and invalid requests are rejected explicitly.

## F5.2 result — ENTER_ROOM

`registerEnterRoom` adds room-id/password validation, a current-room precondition and an injected command adapter. `PolarisRoomEntryAdapter` now completes the required two-stage exchange: `RoomEnter` (2312), `RoomOpen` (758), then `GetRoomEntryData` (2300). Accepted requests remain `pending` until a later room observation confirms entry.

## F5.3 result — WALK_TO

`registerWalkTo` adds non-negative safe-integer coordinate validation, requires an observed room and dispatches movement through an injected command adapter. Accepted requests remain `pending` until a later movement observation confirms the effect.

## F5.4 result — LOOK_AT

`registerLookAt` adds non-negative safe-integer coordinate validation, requires an observed room and dispatches orientation through an injected command adapter. Accepted requests remain `pending` until a later orientation observation confirms the effect.

## F5.5 result — START_TYPING

`registerStartTyping` defines a bodyless semantic action, requires an observed room and dispatches typing state through an injected command adapter. Accepted requests remain `pending` until a later typing observation confirms the effect.

## F5.6 result — STOP_TYPING

`registerStopTyping` mirrors START_TYPING with a bodyless semantic contract and the same room precondition. The Polaris adapter emits the complete `UNIT_TYPING_STOP` packet (1474), paired with `UNIT_TYPING` (1597) for the start transition. Both commands remain pending until a later typing observation confirms the effect.

## F5.7 result — SAY

`registerSay` validates room speech and `PolarisChatAdapter` emits the complete `RoomUserTalkEvent` packet on header 1314 with text, bubble and colour fields. Tests cover exact bytes, validation and room preconditions. A live Polaris/Octane test in room AAA confirmed the test avatar can sit on a selected free stool, speak, and speak again after a confirmed change to a non-active chat-bubble style.

## F5.8 result — WHISPER

`registerWhisper` validates a single-word recipient, room presence and message length. `PolarisChatAdapter` emits the complete `RoomUserWhisperEvent` packet on header 1543, with the recipient prefix, text, bubble and colour fields. A live local test sent a whisper from `octane_test_2_mt` to Cabana in room AAA.

## F5.9 result — SHOUT

`registerShout` validates room speech and `PolarisChatAdapter` emits the complete `RoomUserShoutEvent` packet on header 2085, with text, bubble and colour fields. A live local test sent a Shift+Enter shout from `octane_test_2_mt` in room AAA.

## RoomUsers integration result

`@aura/protocol` now parses Polaris `RoomUsers` packets (server header `374`) with strict field consumption and exposes each observed user's identity and tile position. The contract test decodes both `Cabana` and `octane_test_1_mt` from the same roster.

The runtime bridge registers header `374` with `EventNormalizer` and projects the roster into `WorldStateSnapshot.users`. A live local two-account test in room AAA confirmed the normal visibility path: the account already in the room received a `RoomUsers` packet containing `octane_test_1_mt`, while the entrant received the roster containing `Cabana` and both test accounts. The existing Octane Renderer owns the visual avatar; AURA participates as a normal Polaris client and does not need a second embedded renderer.

## F3.2 result — transport boundary

`@aura/runtime` now exposes `WebSocketSessionTransport`, an adapter over an injected WebSocket implementation that configures binary frames, dispatches inbound payloads, gates sends on an open socket and forwards close/error events. `HeartbeatController` sends periodic pings and invokes a timeout callback when no activity is observed within the configured interval. Both remain independent of protocol packet details and can be tested without a live hotel.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
