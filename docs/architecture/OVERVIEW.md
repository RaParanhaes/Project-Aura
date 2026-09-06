# AURA Architecture Overview

**Status:** accepted foundation direction.

AURA starts as a **modular monolith** using **Ports & Adapters** and an internal event-driven flow.

```mermaid
flowchart TB
    Polaris[Polaris\nAuthoritative game world]
    Protocol[Protocol SDK]
    Adapter[Polaris Adapter]
    Session[RealSession / Session Manager]
    World[World State Projection]
    Events[Event Bus]
    Runtime[Agent Runtime]
    Cap[Capability Registry / Executor]
    Persist[(Persistent State Store)]
    Observe[Observability]
    Future[Future: Perception / Skills / Memory / Social / AI Gateway]

    Polaris <--> Protocol
    Protocol <--> Adapter
    Adapter <--> Session
    Session --> Events
    Events --> World
    Events --> Runtime
    Runtime --> Cap
    Cap --> Adapter
    Runtime <--> Persist
    World --> Runtime
    Events --> Observe
    Runtime --> Observe
    Runtime -. extension .-> Future
```

## Initial module boundaries

- `domain` — stable domain types, IDs, ports and invariants; no infrastructure dependencies.
- `protocol` — wire framing, packet encoding/decoding and protocol contracts; no agent behavior.
- `polaris` — adapter translating semantic AURA requests/events to/from Polaris protocol.
- `runtime` — sessions, event routing, world projection, agent lifecycle and capability orchestration.
- `persistence` — durable stores/migrations/checkpoints behind ports.
- `observability` — structured logs/traces/diagnostics.

We intentionally start with few packages. Split further only when ownership/complexity justifies it.

## Explicitly out of Foundation core

- Ollama/LLM provider.
- long-term memory implementation.
- social engine.
- economy/room planning.
- full event sourcing.
- microservices/Kafka/Redis/Temporal/LangGraph.
