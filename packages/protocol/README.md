# @aura/protocol

## Purpose
Encode/decode the supported Polaris/Habbo wire protocol and expose typed protocol contracts.

## Owns
Packet framing, primitive readers/writers, headers, composers/parsers, fixtures/contracts.

## Does not own
Authentication policy, agent goals, world semantics, persistence or AI behavior.

## Invariants
- Protocol changes are compatibility-sensitive.
- Raw packets do not reach cognitive modules.
- Intentional contract changes require tests and compatibility review.
