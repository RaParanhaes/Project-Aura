# Current Project State

**Completed phases:** D0 — Documentation Foundation; F1 — Development Foundation  
**Current phase:** F2 — Protocol Foundation  
**Last completed milestone:** F2.2 — Study Existing Implementation Evidence  
**Next milestone:** F2.3 — Packet Primitives  
**Status:** F2 IN PROGRESS  
**Implementation status:** COMPATIBILITY TARGET FROZEN + WIRE EVIDENCE CONFIRMED; PACKET PRIMITIVES NOT IMPLEMENTED

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
- Polaris packet contract schema `2`, SHA-256 `fb8dd00dcaa7657b58781b835c035fefc692797c1fabb9db5ba6770ce52d67b`;
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

### Boundary correction

The evidence study proposed several future classes together, but AURA keeps phase ownership explicit:

- **F2.3:** generic PacketReader, PacketWriter, PacketFrame and stream/frame codec only;
- **F2.4:** packet registry/definitions/contracts;
- **F2.5:** concrete handshake/auth/keepalive/room-transition packets;
- **F3:** WebSocketSession, heartbeat orchestration, authentication lifecycle and reconnect/recovery behavior.

Runtime questions about SSO consumption, recovery grace period, port/proxy access and close behavior do **not** block F2.3 primitives. They are retained as integration questions for the phases where AURA can actually observe them.

## Next work — F2.3 Packet Primitives

Implement the generic wire layer without concrete Polaris packet IDs or session lifecycle:

1. `PacketReader` with explicit bounds checking;
2. `PacketWriter`;
3. `PacketFrame`;
4. packet stream/frame codec for length/header/body;
5. support multiple complete packets and incomplete remainder buffering;
6. reject invalid lengths and enforce a configurable maximum packet size;
7. add focused unit/contract fixtures for primitive encoding and frame round-trips.

Do not add packet registry, authentication flow, WebSocket connection lifecycle or room state during F2.3.

## Do not start early

- packet registry/concrete packet catalog before F2.4/F2.5;
- RealSession/WebSocket/authentication lifecycle before F3;
- WorldState implementation (F4);
- Capabilities (F5);
- Persistence/recovery implementation (F6);
- Ollama, memory and social systems.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
