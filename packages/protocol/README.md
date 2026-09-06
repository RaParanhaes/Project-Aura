# @aura/protocol

## Purpose
Encode/decode the supported Polaris/Habbo wire protocol and expose typed protocol contracts.

## Owns
Packet framing, primitive readers/writers, headers, composers/parsers, fixtures/contracts.

## Current public surface
F2.3 provides generic wire mechanics:

- `PacketReader` and `PacketWriter` for confirmed big-endian primitives;
- `PacketFrame` for header + body;
- incremental `PacketStreamCodec` for length-prefixed framing, multiple packets and incomplete remainder buffering;
- typed protocol errors for malformed/bounds/range conditions.

F2.4 adds the identity layer used by later concrete packets:

- immutable `PacketDefinition` metadata for direction, header, logical name and owner;
- `PacketRegistry` lookup by direction plus header or name;
- explicit duplicate and unknown-packet errors;
- frozen Polaris/client/contract compatibility metadata;
- an initial identity catalog for the first session path.

F2.5 adds concrete composers/parsers for the first session path:

- ClientHello, UniqueID and SSOTicket composers;
- Pong and InfoRetrieve composers;
- RoomEnter composer with optional spawn coordinates and the bodyless RoomEntryData composer used after RoomOpen;
- Authenticated, UserHomeRoom, Ping and RoomOpen parsers;
- `UNIT_WALK` composition and strict `UNIT_STATUS` movement/posture observation parsing.
- `ENABLE_EFFECT` clear composer and strict `ROOM_USER_EFFECT` observation parsing; `effectId=0` clears an active room effect.

Every codec resolves its numeric header through `FROZEN_PACKET_REGISTRY`, validates the expected direction and rejects trailing body data. The reader remains fail-fast on malformed/truncated primitive data.

F2.6 adds deterministic first-session byte fixtures and contract tests under `tests/contracts`. The fixtures validate the initial packet surface against the frozen target without storing credentials or claiming runtime WebSocket integration.

## Does not own
Authentication policy, WebSocket/session lifecycle, agent goals, world semantics, persistence or AI behavior.

## Invariants
- Protocol changes are compatibility-sensitive.
- Raw packets do not reach cognitive modules.
- Generic primitives do not know Polaris packet IDs or session behavior.
- Intentional contract changes require tests and compatibility review.
