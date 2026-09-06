# Current Project State

**Completed phases:** D0 — Documentation Foundation; F1 — Development Foundation  
**Current phase:** F5 — Capabilities
**Last completed milestone:** F5.5 — START_TYPING
**Next milestone:** F5.6 — STOP_TYPING
**Status:** F5 IN PROGRESS
**Implementation status:** F3/F4 COMPLETE; F5.1 COMPLETE; F5.2 ENTER_ROOM IMPLEMENTED; F5.3 WALK_TO IMPLEMENTED; F5.4 LOOK_AT IMPLEMENTED; F5.5 START_TYPING IMPLEMENTED; F5.5 START_TYPING IMPLEMENTED

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
- room enter with optional spawn coordinates;
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

`registerEnterRoom` adds room-id/password validation, a current-room precondition and an injected command adapter. Accepted requests remain `pending` until a later room observation confirms entry.

## F5.3 result — WALK_TO

`registerWalkTo` adds non-negative safe-integer coordinate validation, requires an observed room and dispatches movement through an injected command adapter. Accepted requests remain `pending` until a later movement observation confirms the effect.

## F5.5 result — START_TYPING

`registerStartTyping` defines a bodyless semantic action, requires an observed room and dispatches typing state through an injected command adapter. Accepted requests remain `pending` until a later typing observation confirms the effect.`

## RoomUsers integration result

`@aura/protocol` parses Polaris `RoomUsers` packets (server header `374`) with strict field consumption and exposes each observed user's identity and tile position. The contract fixture decodes both `Cabana` and `octane_test_1_mt` from one roster. This proves roster interpretation; browser rendering remains an adapter concern.

## F3.2 result — transport boundary

`@aura/runtime` now exposes `WebSocketSessionTransport`, an adapter over an injected WebSocket implementation that configures binary frames, dispatches inbound payloads, gates sends on an open socket and forwards close/error events. `HeartbeatController` sends periodic pings and invokes a timeout callback when no activity is observed within the configured interval. Both remain independent of protocol packet details and can be tested without a live hotel.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
