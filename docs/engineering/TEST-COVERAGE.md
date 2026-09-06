# AURA Test Coverage Matrix

This is the living answer to: **what proves feature X works?**

Legend: ✅ covered · ⚠ partial · — not yet implemented · ENV requires external environment.

| Feature | Unit | Contract | Polaris Integration | Scenario | Recovery | Load |
|---|---:|---:|---:|---:|---:|---:|
| Repository structure | ✅ | — | — | — | — | — |
| Packet codec | — | — | — | — | — | — |
| Authentication | — | — | — | — | — | — |
| Enter room / hydration | — | — | — | — | — | — |
| Walk | — | — | — | — | — | — |
| Look / turn | — | — | — | — | — | — |
| Typing | — | — | — | — | — | — |
| Chat | — | — | — | — | — | — |
| Reconnect | — | — | — | — | — | — |
| AURA restart recovery | — | — | — | — | — | — |
| 30 sessions | — | — | — | — | — | — |

## Planned Golden Scenarios

- `GS-001` login → room → walk → typing → chat.
- `GS-002` disconnect → reconnect/session resume.
- `GS-003` Polaris restart → AURA reconciliation.
- `GS-004` multiple real sessions share a room.
- `GS-005` AURA process restart → durable agent state restored.
