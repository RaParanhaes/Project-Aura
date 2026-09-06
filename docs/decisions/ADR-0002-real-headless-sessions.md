# ADR-0002 — Represent residents as real headless sessions

**Status:** Accepted

## Context

AURA residents should appear and behave like registered users without running a renderer/browser per resident.

## Decision

Each active AURA resident connects through a normal authenticated headless game session using the supported client protocol.

## Consequences

AURA must implement robust protocol/session lifecycle management and scale one process from a small proof to approximately 30 sessions. Polaris stress bots or synthetic `RoomUnitType.BOT` entities are not resident implementations.
