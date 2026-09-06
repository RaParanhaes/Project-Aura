# Polaris Protocol Evidence — F2.2

Status: **CONFIRMED STATIC EVIDENCE for the frozen F2.1 target**

This document records the implementation evidence that defines the protocol rules AURA may use when beginning packet primitives. It summarizes the frozen local Polaris/Octane/Renderer code study; it is not a runtime-integration success claim.

Compatibility identity and hashes live in `docs/reference/COMPATIBILITY.md`.

## Authority used

Evidence priority for this study:

1. frozen local Polaris implementation and `packet-field-contracts.json`;
2. frozen Octane Renderer/client behavior;
3. local Octane integration behavior;
4. `cayank/packet-client` as external reference only.

The current dirty Polaris/Octane changes were inspected and do not modify the protocol areas covered below.

## Confirmed wire format

Normal protocol framing is binary and big-endian:

```text
[4-byte packet length][2-byte packet header][body fields]
```

The length value covers everything after the length prefix. Therefore a bodyless packet has `length = 2` because the 2-byte header remains.

| Primitive | Encoding | Size |
|---|---|---:|
| packet length | signed 32-bit integer, big-endian | 4 bytes |
| packet header | signed 16-bit short, big-endian | 2 bytes |
| byte | raw byte | 1 byte |
| boolean | byte `1` or `0` | 1 byte |
| short | signed 16-bit, big-endian | 2 bytes |
| integer | signed 32-bit, big-endian | 4 bytes |
| long | signed 64-bit where used | 8 bytes |
| double | IEEE-754, big-endian | 8 bytes |
| string | unsigned 16-bit byte length + UTF-8 bytes | 2 + N bytes |
| bytes | raw packet-specific bytes | variable |

Strings use UTF-8. Empty strings use length zero. `ServerMessage.appendString(null)` is effectively serialized as an empty string; there is no universal null marker.

The server commonly writes one protocol packet per binary WebSocket frame, but the protocol decoder must **not** assume a 1:1 WebSocket-message-to-packet relationship. Both Polaris and Octane evidence support partial packet buffering and multiple concatenated packets.

### Malformed/incomplete input

Confirmed behavior relevant to AURA:

- non-binary/non-final WebSocket frames are rejected by the current Polaris WebSocket codec;
- oversized packet lengths are rejected by the frame decoder;
- incomplete packets remain buffered until enough bytes arrive;
- truncated field behavior is not uniformly strict in the Java reader;
- truncated strings may be limited to available bytes by the current Java implementation.

AURA should use stricter explicit bounds checking and fail malformed packet parsing deterministically rather than copy permissive Java fallbacks unless a fixture proves compatibility requires them.

### Compression / encryption

For the frozen target:

- normal payload compression is not active;
- `crypto.ws.enabled=false`;
- `enc.enabled=false`;
- no additional transform is required for the normal packet payload.

Optional Diffie-Hellman/AES-GCM code exists but is outside the active compatibility target and must not be implemented pre-emptively.

## Minimum session sequence evidence

The initial Octane sequence is confirmed as:

```text
WebSocket connected
→ ReleaseVersion
→ MachineID
→ SecureLogin / SSO
→ Authenticated
→ initial server snapshots
→ InfoRetrieve from Octane
→ application Ping/Pong heartbeat
→ RoomEnter when requested
→ RoomOpen from Polaris
→ GetRoomEntryData from the client
→ Polaris adds the user and broadcasts RoomUsers
```

Key packets identified for later F2.5 contract implementation:

| Step | Direction | Packet | Header | Important fields |
|---:|---|---|---:|---|
| 1 | C→S | ReleaseVersionEvent / ClientHelloMessageComposer | 4000 | release string; client sends additional platform/device fields |
| 2 | C→S | MachineIDEvent / UniqueIDMessageComposer | 2490 | machine id, fingerprint, flash/client version strings |
| 3 | C→S | SecureLoginEvent / SSOTicketMessageComposer | 2419 | SSO string, client timestamp int, optional recovery-token string |
| 4 | S→C | SecureLoginOKComposer / AuthenticatedParser | 2491 | session-resumed boolean, room id int, recovery token string |
| 5 | S→C | UserHomeRoomComposer | 2875 | two integers |
| 6 | S→C | initial user/session snapshots | various | packet-specific |
| 7 | S→C | PingComposer | 3928 | empty body |
| 8 | C→S | PongMessageComposer | 2596 | empty body |
| 9 | C→S | InfoRetrieveMessageComposer | 357 | empty body |
| 10 | C→S | RequestRoomLoadEvent / RoomEnterComposer | 2312 | room id, password; optional spawn coordinates |
| 11 | S→C | RoomOpenComposer / RoomEnterParser | 758 | empty body; room assets may now be requested |
| 12 | C→S | RequestRoomHeightmapEvent / GetRoomEntryDataMessageComposer | 2300 | empty body; completes entry and triggers room roster broadcast |

The following room responses are relevant to later F4 hydration, not F2.3 primitives: RoomModel (2031), RoomRelativeMap (2753), RoomHeightMap (1301), RoomData (687), RoomUsers (374), plus unit/status messages.

## Authentication findings

`SecureLoginEvent` is the normal protocol authentication packet for the current stack.

Confirmed server flow:

1. validate allowed client release;
2. normalize and validate SSO input;
3. resolve the user through `users.auth_ticket`;
4. perform ban/security checks;
5. load/connect the Habbo user;
6. emit `SecureLoginOKComposer`.

The normal `HabboManager.loadHabbo(String)` path explicitly consumes the SSO ticket after loading the user by clearing `auth_ticket` and `auth_ticket_expires_at`, except when debug SSO is enabled. A contradictory source comment exists; runtime verification remains appropriate later, but static executable code indicates consumption.

AURA boundary:

- `packages/protocol` only knows how to serialize/parse the authentication packet;
- the future AuthProvider obtains/renews SSO credentials;
- session runtime stores and protects recovery-token state;
- reconnect logic decides when a recovery token may be reused.

SSO/password/ticket values must never be logged or stored as research fixtures.

## Heartbeat and reconnect evidence

The primary session heartbeat is an **application packet exchange**, not merely WebSocket control-frame ping/pong:

- server `PingComposer`: header `3928`;
- client `PongMessageComposer`: header `2596`;
- server ping interval is approximately 30 seconds in the inspected code;
- timeout is approximately 60 seconds without the expected pong;
- timeout closes the channel without a dedicated application close code/reason in the inspected path.

A separate C→S packet with header `295` exists for another latency path and is not the primary session heartbeat.

Session-resume infrastructure exists in Polaris (`SessionResumeManager`) and the Renderer implements retry/backoff plus recovery-token handling. The exact effective recovery grace period depends on persisted runtime configuration and remains a later integration question.

## Dirty-tree impact

The frozen local Polaris modifications include unrelated gameplay/data areas such as catalog, pets, Trax, localization, friends and associated SQL.

No relevant local modification was found in:

- WebSocket framing/codec pipeline;
- packet length/header decoding;
- primitive readers/writers;
- packet IDs;
- release validation;
- SecureLogin;
- heartbeat;
- session-resume implementation;
- room-entry handlers;
- `packet-field-contracts.json`.

The dirty Octane tree likewise contains no relevant framing or connection-lifecycle change. Octane Renderer is clean at the frozen commit.

Therefore F2 protocol primitives may be derived from the inspected target without a special local-patch fork of framing rules.

## Octane comparison

Renderer evidence independently agrees with Polaris on:

- 4-byte length prefix;
- 2-byte header;
- big-endian primitive encoding;
- UTF-8 strings;
- buffering/remainder handling;
- decoding multiple complete packets from accumulated bytes.

Observed differences that matter:

- Renderer `ClientHelloMessageComposer` currently writes `NITRO-3-6-0` and additional platform/device fields;
- Polaris uses the first release field relevant to release validation;
- Octane sends Machine ID before SSO;
- Octane sends `InfoRetrieveMessageComposer` after authentication, but no meaningful corresponding local Polaris handler was identified during the static study;
- direct room entry uses `RoomEnterComposer`; guest-room metadata retrieval is not necessarily a prerequisite for direct entry.

## `packet-field-contracts.json`

The frozen schema-2 contract is the machine-readable seed for packet direction, header identity and field shape. It is generated/validated against Polaris packet metadata through the packet-contract manifest/catalog tooling and coverage tests.

It is not sufficient as the sole authority for semantic behavior. F2 packet work must pair contract entries with the corresponding Polaris handler/composer when behavior, optional fields or failure semantics matter.

Evidence symbols include:

- `PacketContractManifest`
- `PacketContractManifestLoader`
- `PacketContractCatalogGenerator`
- `PacketContractCoverageTest`
- `PacketContractCatalogTest`

## External packet-client assessment

`cayank/packet-client` is ISC licensed and is useful as a TypeScript reference for codec organization, WebSocket lifecycle, login, room, chat, movement and session behavior.

Current AURA reuse decision for F2:

- classification: **REFERENCE**;
- do not add it as a dependency;
- do not vendor it;
- do not copy packet IDs without reconciling them with the frozen Polaris contract;
- small adaptations may be considered later only when explicitly reviewed and recorded.

AURA will implement the minimal protocol core against frozen Polaris evidence rather than inherit another client's compatibility assumptions.

## Phase-boundary decision after F2.2

The local audit proposed a broader implementation set, but AURA keeps the roadmap boundaries strict.

### F2.3 — Packet primitives

Implement only generic wire mechanics:

- `PacketReader`
  - byte
  - boolean
  - short
  - int
  - long
  - string
  - bytes
  - explicit bounds checking
- `PacketWriter`
  - byte
  - boolean
  - short
  - int
  - long
  - string
  - bytes
- `PacketFrame` (header + body)
- stream/frame codec
  - encode length + header + body
  - decode multiple packets
  - preserve incomplete remainder
  - reject invalid length
  - configurable maximum packet size

Do **not** add concrete packet headers or session lifecycle to F2.3.

### F2.4 — Registry and contracts

Add packet definitions/registry, direction, logical names, header identities and contract metadata.

### F2.5 — Initial concrete packets

Add the minimum handshake/auth/keepalive/room-transition packet contracts such as ReleaseVersion, MachineID, SecureLogin, Authenticated, Ping/Pong and RoomEnter.

### F3 — RealSession

WebSocket connection lifecycle, heartbeat controller, authentication orchestration, reconnect/backoff and recovery-token lifecycle belong to RealSession, not F2.3.

## Runtime questions that remain

These do not block F2.3 generic primitives:

- effective session-resume grace period loaded from the real database;
- exact runtime behavior around SSO consume/reuse and recovery-token reconnect;
- whether host access will use direct localhost `2096` or an HTTP/WebSocket proxy;
- confirmation that the running Polaris container listens on the expected interface/port;
- effective close code/reason on heartbeat timeout;
- whether `InfoRetrieveMessageComposer` is ignored or has an indirect runtime effect.

Resolve these when the relevant concrete packet/session integration can actually observe them. Do not guess them into primitive codec code.

## Evidence map

### Framing / primitive encoding

- `Polaris-Emulator/Emulator/src/main/java/com/eu/habbo/networking/gameserver/codec/WebSocketCodec.java`
- `.../WebSocketChannelInitializer.java`
- `.../GameByteFrameDecoder.java`
- `.../GameByteDecoder.java`
- `.../ClientMessage.java`
- `.../ServerMessage.java`
- `Octane-Renderer/packages/communication/src/codec/evawire/EvaWireFormat.ts`
- `.../BinaryReader.ts`
- `.../BinaryWriter.ts`
- `.../SocketConnection.ts`

### Handshake / authentication

- `.../messages/incoming/handshake/ReleaseVersionEvent.java`
- `.../MachineIDEvent.java`
- `.../SecureLoginEvent.java`
- `.../SecureLoginInputGuard.java`
- `.../ClientReleaseGuard.java`
- `.../HabboManager.java`
- `.../SessionResumeManager.java`
- `.../SessionRecoveryRuntime.java`
- `.../SecureLoginOKComposer.java`
- `Octane-Renderer/packages/communication/src/CommunicationManager.ts`
- `.../ClientHelloMessageComposer.ts`
- `.../UniqueIDMessageComposer.ts`
- `.../SSOTicketMessageComposer.ts`
- `.../AuthenticatedParser.ts`

### Heartbeat

- `.../IdleTimeoutHandler.java`
- `.../PingComposer.java`
- `.../PongEvent.java`
- `Octane-Renderer/.../ClientPingEvent.ts`
- `.../PongMessageComposer.ts`

### Room-entry evidence

- `.../RequestRoomDataEvent.java`
- `.../RequestRoomLoadEvent.java`
- `.../RequestRoomHeightmapEvent.java`
- `.../RoomManager.java`
- `.../RoomOpenComposer.java`
- `.../RoomModelComposer.java`
- `.../RoomRelativeMapComposer.java`
- `.../RoomHeightMapComposer.java`
- `.../RoomDataComposer.java`
- `Octane-Renderer/.../RoomSessionManager.ts`
- `.../RoomEnterComposer.ts`

## F2.2 completion statement

F2.2 is complete as a static evidence study. The generic wire rules required for F2.3 are sufficiently confirmed from the frozen Polaris/Octane target, and unresolved runtime questions are explicitly separated from primitive codec behavior.
