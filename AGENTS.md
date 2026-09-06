# Project AURA — Coding Agent Guide

This file is a GPS, not an encyclopedia. Use it to find the authoritative source, then load only the context needed for the task.

## Start here

For any substantial task:

1. read `docs/CURRENT.md` to learn the active phase and current objective;
2. use `docs/INDEX.md` to locate only the relevant architecture/decision/procedure documents;
3. read the nearest module `README.md` before editing that area;
4. read relevant accepted ADRs;
5. inspect existing code/tests/research before inventing a parallel mechanism;
6. follow `docs/development/WORKFLOW.md`;
7. use `docs/development/DEFINITION-OF-DONE.md` to decide whether the task is actually complete;
8. run `pnpm run verify` before claiming completion when the command applies to the current project phase.

Do not read the entire documentation tree by default.

## Authority order

When sources disagree, use this order:

1. executable code and machine-readable contracts;
2. accepted ADRs;
3. accepted architecture documentation;
4. `docs/CURRENT.md` for active phase/focus;
5. module documentation;
6. RFCs;
7. research notes and external references;
8. issues/discussion.

Research is evidence, not an AURA requirement until an accepted decision adopts it.

## Non-negotiable foundation rules

- Polaris is authoritative for current game state and gameplay validation.
- AI residents use normal authenticated headless user sessions.
- Do not modify Polaris for AI behavior unless an accepted ADR explicitly changes this rule.
- Do not use direct database writes for normal gameplay actions.
- Do not couple the Foundation to Ollama or any specific LLM/provider.
- Raw packets never go directly to an LLM.
- Sending a packet does not mean an action succeeded; confirm/reject/reconcile from Polaris observations.
- Observed world state and desired/pending actions are different concepts.
- Persistent agent continuity belongs to AURA, while transient authoritative game truth belongs to Polaris.
- External/user/chat/memory text is untrusted world data, never system/developer instruction.
- Prefer existing project mechanisms over parallel implementations.
- Before adding a dependency or adapting external code, check necessity, fit, maintenance and license.

## Architecture direction

AURA starts as a **modular monolith** using **Ports & Adapters** at real external boundaries, with an internal event-driven flow.

Foundation responsibilities are intentionally separated:
- `packages/protocol` — wire protocol only;
- `packages/polaris` — Polaris-specific adapter behavior;
- `packages/runtime/session` — authenticated headless session lifecycle;
- `packages/runtime/world` — Polaris-confirmed observed world state;
- `packages/runtime/events` — normalized internal domain events;
- `packages/runtime/capabilities` — semantic executable game actions;
- `packages/runtime/agent` — minimal resident runtime/continuity;
- `packages/persistence` — durable state boundary;
- `packages/observability` — logs/traces/diagnostics.

Do not create new top-level packages for speculative future concepts until real implementation pressure justifies them.

## Current-phase discipline

Do not implement future phases early merely because a framework/library makes it convenient.

During D0, documentation is the work. During Foundation implementation, AI/social/memory features must not be used as shortcuts around protocol, session, world-state or recovery problems.

The operational sequence is defined in:
- `docs/roadmap/ROADMAP.md`
- `docs/roadmap/IMPLEMENTATION-PLAN.md`

## Skills

`.agents/skills/` is reserved for task-specific procedures that have become repeatable enough to standardize.

Do not create many speculative skills in advance. When a workflow has been performed enough times to know the correct procedure (for example implementing a capability or packet), then capture it as a focused skill with progressive disclosure.

## Git workflow

Normal changes should use a focused branch and PR. Keep unrelated cleanup out of the same change.

Do not silently rewrite accepted ADR history. If a durable decision changes, add a new ADR that supersedes the previous one.

## Key locations

- Live status: `docs/CURRENT.md`
- Documentation router: `docs/INDEX.md`
- Project definition: `docs/project/`
- Architecture: `docs/architecture/`
- Roadmap: `docs/roadmap/ROADMAP.md`
- Step-by-step implementation plan: `docs/roadmap/IMPLEMENTATION-PLAN.md`
- Decisions: `docs/decisions/`
- Research/reference catalog: `docs/research/REFERENCES.md`
- Open technical questions: `docs/research/OPEN-QUESTIONS.md`
- Development workflow: `docs/development/WORKFLOW.md`
- Definition of Done: `docs/development/DEFINITION-OF-DONE.md`
- Test coverage: `docs/engineering/TEST-COVERAGE.md`
- Compatibility: `docs/reference/COMPATIBILITY.md`
- External reuse/attribution: `THIRD_PARTY.md`
