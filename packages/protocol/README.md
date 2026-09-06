# @aura/protocol

## Purpose
Encode/decode the supported Polaris/Habbo wire protocol and expose typed protocol contracts.

## Owns
Packet framing, primitive readers/writers, headers, composers/parsers, fixtures/contracts.

## Current public surface
F2.3 provides only generic wire mechanics:

- `PacketReader` and `PacketWriter` for confirmed big-endian primitives;
- `PacketFrame` for header + body;
- incremental `PacketStreamCodec` for length-prefixed framing, multiple packets and incomplete remainder buffering;
- typed protocol errors for malformed/bounds/range conditions.

The reader is intentionally fail-fast on malformed/truncated primitive data. Concrete packet identities and registry metadata start in F2.4/F2.5, not in the primitive layer.

## Does not own
Authentication policy, WebSocket/session lifecycle, agent goals, world semantics, persistence or AI behavior.

## Invariants
- Protocol changes are compatibility-sensitive.
- Raw packets do not reach cognitive modules.
- Generic primitives do not know Polaris packet IDs or session behavior.
- Intentional contract changes require tests and compatibility review.
