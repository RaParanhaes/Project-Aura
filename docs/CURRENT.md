# Current Project State

**Completed phase:** D0 — Documentation Foundation  
**Current phase:** F1 — Development Foundation  
**Current milestone:** F1.1 — Runtime / Workspace Baseline  
**Status:** IN PROGRESS  
**Implementation status:** STARTED — TOOLING ONLY

## Current objective

Turn the approved repository skeleton into a real strict TypeScript workspace without implementing Polaris protocol, sessions, gameplay behavior or AI logic.

## F1.1 scope

- keep Node.js constrained to major 24;
- keep pnpm pinned through `packageManager`;
- pin a stable TypeScript compiler version;
- add a shared strict TypeScript configuration;
- make `apps/aura-core` and every existing `packages/*` directory a real workspace project;
- prove workspace package resolution with type-only imports;
- add type checking to `pnpm run verify` and GitHub Actions.

## Explicitly out of this change

- Test framework setup (F1.2).
- Architecture dependency enforcement (F1.3).
- Pino/structured logging implementation (F1.4).
- Polaris packet implementation (F2).
- RealSession/WebSocket/authentication (F3).
- WorldState implementation (F4).
- Capabilities (F5).
- Persistence/recovery implementation (F6).
- Ollama, memory and social systems.

## Next after F1.1

**F1.2 — Test Baseline:** add Vitest and the first smoke/unit test only after this workspace baseline is green and accepted.

Detailed sequence: `roadmap/IMPLEMENTATION-PLAN.md`.
