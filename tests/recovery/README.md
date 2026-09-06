# Recovery Tests

Exercise failures where a normal success-path test is not enough.

Examples:
- WebSocket loss during movement
- AURA restart with persisted agent state
- Polaris restart and room/session recovery
- ambiguous external effects such as purchase/trade confirmation

Recovery tests should verify both final state and absence of duplicate side effects.
