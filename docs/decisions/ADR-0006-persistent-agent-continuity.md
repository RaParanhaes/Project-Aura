# ADR-0006 — Persist agent continuity outside Polaris

**Status:** Accepted

## Context

A Polaris restart or AURA process crash must not erase who a resident is or what durable objective it was pursuing.

## Decision

AURA owns versioned persistent agent state/checkpoints independently of live WebSocket/process objects. Polaris session resume is used when available but is not the sole continuity mechanism.

## Consequences

Sockets, timers and live clients are recreated after restart. Durable state is validated/migrated before runtime restoration. Recovery reconciles stored intent with the current Polaris world instead of blindly resuming stale actions.
