# Runtime / Events

Owns normalized domain events used internally by AURA.

## Owns
- event names and typed payload contracts
- ordering rules
- coalescing policies where safe
- event publication/subscription boundaries

## Examples
- `USER_ENTERED_ROOM`
- `USER_SPOKE`
- `USER_TYPING_STARTED`
- `SESSION_DISCONNECTED`
- `ACTION_CONFIRMED`

## Does not own
- raw Polaris packet parsing
- world persistence
- agent reasoning

## Core invariant
Raw packet headers never leak as business/domain events beyond the protocol/adapter boundary.
