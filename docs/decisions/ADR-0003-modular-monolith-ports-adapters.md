# ADR-0003 — Start as a modular monolith with Ports & Adapters

**Status:** Accepted

## Context

The project must be easy to evolve without paying distributed-systems complexity before it is justified.

## Decision

AURA begins as one deployable Node.js/TypeScript service with strong internal module boundaries. External systems (game server, persistence and later LLM providers) are accessed behind focused ports/adapters.

## Consequences

We avoid microservices/Kafka/Temporal/LangGraph in Foundation. Internal boundaries must still be testable and later extractable if scale or ownership requires it.
