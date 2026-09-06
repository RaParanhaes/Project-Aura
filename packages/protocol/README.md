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

The reader remains fail-fast on malformed/truncated primitive data. Registry definitions do not contain body codecs; concrete composers/parsers begin in F2.5.

## Does not own
Authentication policy, WebSocket/session lifecycle, agent goals, world semantics, persistence or AI behavior.

## Invariants
- Protocol changes are compatibility-sensitive.
- Raw packets do not reach cognitive modules.
- Generic primitives do not know Polaris packet IDs or session behavior.
- Intentional contract changes require tests and compatibility review.
