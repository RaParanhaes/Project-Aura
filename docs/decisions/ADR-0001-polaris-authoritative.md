# ADR-0001 — Keep Polaris authoritative

**Status:** Accepted

## Context

AURA needs to interact with an existing Octane + Polaris hotel while remaining evolvable and avoiding two competing sources of game truth.

## Decision

Polaris remains authoritative for rooms, users, inventory, economy, permissions and gameplay validation. Normal gameplay uses the normal game protocol. Direct database mutation is not an AURA gameplay mechanism.

## Consequences

AURA must observe Polaris responses/state changes to confirm outcomes. AI-specific behavior belongs outside Polaris unless a future accepted ADR proves a server change unavoidable.
