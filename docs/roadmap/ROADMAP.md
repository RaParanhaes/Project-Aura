# Project AURA — Roadmap

This roadmap defines the intended delivery order. It is intentionally high level. Detailed execution lives in `IMPLEMENTATION-PLAN.md`.

## D0 — Documentation Foundation

Make the repository self-explanatory before functional implementation begins.

Deliverables:
- project objectives and vocabulary;
- accepted architecture and flow;
- ADRs for decisions already made;
- implementation roadmap;
- research references and open questions;
- coding-agent navigation rules;
- development workflow and Definition of Done.

Exit condition: a new coding agent can understand what AURA is, what is already decided, what is not decided and what task comes next without relying on chat history.

## F1 — Development Foundation

Create the minimum TypeScript/Node workspace and quality gates needed to safely implement the product.

Expected areas:
- TypeScript strict configuration;
- workspace/package boundaries;
- unit test runner;
- architecture/dependency checks;
- repository verification command;
- structured logging baseline.

## F2 — Protocol Foundation

Build and validate the low-level Polaris protocol layer.

Expected areas:
- tested Polaris version/contract snapshot;
- packet framing and primitive fields;
- packet registry/contracts;
- fixtures;
- contract/property tests;
- minimum handshake/auth/keepalive packets.

## F3 — RealSession

Prove one real authenticated headless user can live on the normal Polaris protocol.

Expected areas:
- WebSocket lifecycle;
- authentication provider boundary;
- handshake/login;
- heartbeat;
- disconnect/reconnect lifecycle;
- integration tests.

## F4 — WorldState

Build a coherent observed projection of the hotel state needed by an agent.

Expected areas:
- room transitions;
- room hydration/readiness;
- users and identities;
- positions/statuses;
- chat and typing;
- normalized domain events.

## F5 — Capabilities

Expose gameplay through semantic actions instead of raw packets.

Initial capabilities:
- enter/leave room;
- walk;
- look at;
- start/stop typing;
- say.

Every capability must define preconditions and execution/confirmation semantics.

## F6 — Persistence & Recovery

Preserve resident continuity across transient failures and process/server restarts.

Expected areas:
- versioned AgentState;
- checkpoints;
- ActionJournal;
- recovery semantics;
- reconciliation after ambiguous actions;
- restart tests.

## F7 — Multi-session

Scale the same architecture progressively:

1 → 4 → 10 → 20 → approximately 30 residents.

Focus on lifecycle isolation, fairness, resource usage and failure containment.

## F8 — Foundation Validation

Validate the complete non-AI platform through golden scenarios, recovery scenarios and load tests.

Foundation acceptance target:
- real headless residents connect through normal protocol;
- room/world projection remains coherent;
- basic capabilities execute and are confirmed;
- reconnect/recovery works;
- multiple agents operate concurrently;
- logs/tests make failures diagnosable.

At this point the project may declare **AURA FOUNDATION STABLE**.

---

# Post-Foundation product layers

These layers are intentionally not frozen in detail yet. Their architecture will be decided using evidence from the working Foundation.

The active detailed sequence begins in [`POST-FOUNDATION.md`](POST-FOUNDATION.md) with **P1 — Perception and attention**.

Possible sequence:

- Perception and attention;
- Goals and activities;
- Skills and habits;
- Social engine and group conversations;
- Memory and knowledge;
- Shared LLM gateway / Ollama;
- Human-realism systems;
- Economy, furniture/room planning and extended gameplay.

The exact order may change through accepted ADRs as real implementation evidence becomes available.
