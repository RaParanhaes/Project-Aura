# Runtime / Session

Owns the lifecycle of one authenticated headless game session.

## Owns
- connection lifecycle
- authentication state
- heartbeat and disconnect detection
- reconnect and session-resume orchestration
- session state machine

## Does not own
- packet encoding details
- agent goals or memory
- room/world semantics
- LLM decisions

## Core invariant
At most one authenticated `RealSession` may be active for the same AURA agent.
