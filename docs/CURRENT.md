# Current Project State

**Completed phases:** D0 — Documentation Foundation; F1 — Development Foundation  
**Current phase:** F2 — Protocol Foundation  
**Last completed milestone:** F2.3 — Packet Primitives  
**Next milestone:** F2.4 — Registry and Contracts  
**Status:** F2 IN PROGRESS  
**Implementation status:** COMPATIBILITY TARGET + WIRE EVIDENCE + PACKET PRIMITIVES READY; REGISTRY NOT IMPLEMENTED

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

## Next work — F2.4 Registry and Contracts

Build the typed packet identity layer on top of the generic wire primitives:

1. define packet direction and stable packet-definition contracts;
2. represent numeric header, logical name and parser/composer ownership without scattering magic IDs;
3. seed definitions from the frozen schema-2 `packet-field-contracts.json` evidence;
4. keep registry metadata separate from WebSocket/session lifecycle;
5. add tests for duplicate headers, unknown lookups and allowed direction semantics;
6. do not implement concrete handshake/auth packet bodies until F2.5.

## Do not start early

- concrete handshake/auth/keepalive packet implementations before F2.5;
- RealSession/WebSocket/authentication lifecycle before F3;
- WorldState implementation (F4);
- Capabilities (F5);
- Persistence/recovery implementation (F6);
- Ollama, memory and social systems.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
