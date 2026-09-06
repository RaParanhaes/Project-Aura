# ADR-0004 — Do not depend on an LLM in Foundation

**Status:** Accepted

## Context

Protocol/session/recovery bugs must be distinguishable from model behavior, and most game mechanics do not require language reasoning.

## Decision

F0–F7 Foundation must work without Ollama or another LLM provider.

## Consequences

The architecture reserves extension points for a future AI Gateway, but protocol, sessions, world state, capabilities, persistence and recovery cannot import or require an LLM implementation.
