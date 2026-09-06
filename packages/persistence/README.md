# @aura/persistence

## Purpose
Provide the durable state boundary behind repositories and later checkpoint/recovery adapters.

## F6.1 durable state boundary
`AgentState` is schema-versioned and contains only continuity that can be restored after a process restart: stable identity, objective, room references and update time. `parseAgentState` validates untrusted data before restoration and rejects unknown fields, including sockets, timers and live clients. `AgentStateRepository` is the storage port; `InMemoryAgentStateRepository` is a deterministic test adapter, not the production database.

## Invariants
- persisted data is versioned and validated before restore;
- sockets, timers, live clients and transient world rosters are never persisted;
- schema changes require an explicit migration;
- ambiguous external effects are reconciled, not blindly replayed.

## F6.2 ActionJournal
`ActionJournal` records an action ID, semantic intent, start time and observed outcome. An action starts as `pending`; an ambiguous external result may later be reconciled to `confirmed` or `rejected`. Final outcomes cannot be overwritten, preventing blind replay of side effects.

## F6.4 reconciliation
`ActionReconciler` requires a Polaris observation for every ambiguous action. Confirmed or rejected observations resolve the journal entry; an unknown observation keeps it ambiguous and always reports `retryAllowed: false`, so non-idempotent effects are never blindly replayed.
