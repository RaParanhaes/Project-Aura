# @aura/persistence

## Purpose
Provide durable state, migrations/checkpoints and recovery storage behind ports.

## Initial direction
Start local/simple for one AURA process. SQLite + WAL/Drizzle is the current candidate, but implementation begins only after the persistence port/state schema is defined.

## Invariants
- persisted data is versioned;
- persisted data is validated before restore;
- sockets/timers/live clients are never persisted;
- ambiguous external effects are reconciled, not blindly replayed.
