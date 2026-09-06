# Runtime / Capabilities

Owns the semantic actions AURA is allowed to request from the game world.

## Owns
- capability names and arguments
- preconditions and validation hooks
- execution contracts
- recovery semantics
- action-result expectations

## Early capabilities
- `WALK_TO`
- `LOOK_AT`
- `SAY`
- `START_TYPING`
- `STOP_TYPING`
- `ENTER_ROOM`

## Does not own
- LLM reasoning
- packet numbers
- raw WebSocket writes

## Core invariant
A capability request is not considered successful until its effect is confirmed or reconciled against Polaris state.
