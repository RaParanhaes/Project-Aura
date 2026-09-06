# Project AURA

**AURA — Autonomous User Resident Agents**

Project AURA is an external platform for persistent autonomous residents that connect to a Polaris-based hotel as normal headless users.

AURA is not the game server and is not the renderer:

- **Polaris** remains authoritative for the game world and gameplay rules.
- **Octane** remains the human-facing client/renderer.
- **AURA** manages headless sessions, world projections, agent continuity, capabilities, recovery and, later, cognition/social behavior.
- **LLMs (for example Ollama)** are optional reasoning providers used only when language or higher-level reasoning is needed.

## Project status

**D0 — Documentation Foundation: COMPLETE**  
**F1 — Development Foundation: COMPLETE**  
**Current phase: F2 — Protocol Foundation**  
**Next milestone: F2.1 — Freeze Compatibility Target**

The repository has a verified TypeScript/Node development foundation. Polaris protocol/session/gameplay implementation has not started yet; F2 begins by freezing the exact Polaris/Octane compatibility target before packet code is written.

Start with:

1. [`docs/CURRENT.md`](docs/CURRENT.md)
2. [`docs/INDEX.md`](docs/INDEX.md)

## Core rule

> Polaris stores the current truth of the game. AURA stores the continuity of the agent.

AURA must never assume an action succeeded merely because it sent a packet. Observed world state is updated from events confirmed by Polaris.

## Repository map

```text
Project-Aura/
├── apps/
│   └── aura-core/              # executable AURA application/composition root
├── packages/
│   ├── domain/                 # stable domain concepts and ports
│   ├── protocol/               # Polaris wire protocol contracts/codecs
│   ├── polaris/                # Polaris-specific adapter
│   ├── runtime/
│   │   ├── session/            # headless connection lifecycle
│   │   ├── world/              # observed world projection
│   │   ├── events/             # normalized internal events
│   │   ├── capabilities/       # semantic executable actions
│   │   └── agent/              # minimal resident runtime/continuity
│   ├── persistence/            # durable state adapters
│   └── observability/          # logs, traces and diagnostics
├── tests/
│   ├── unit/
│   ├── contracts/
│   ├── integration/
│   ├── scenarios/
│   ├── recovery/
│   └── load/
├── docs/                       # durable project knowledge and decisions
├── .agents/skills/             # repeatable coding-agent procedures when mature
├── scripts/                    # developer workflow utilities
└── .github/                    # CI and contribution templates
```

## F1 development baseline

The current development foundation includes:

- Node.js 24.x;
- pnpm 11.25.0;
- committed `pnpm-lock.yaml`;
- TypeScript 7.0.2 strict workspace configuration;
- Vitest 5.0.0;
- architecture/import/cycle guardrails;
- Pino 10.3.1 structured logging;
- one canonical `pnpm run verify` quality gate.

A JavaScript `dist/` build is intentionally not emitted yet. The workspaces are still private development surfaces and no executable RealSession runtime exists to package. Build/emission will be introduced when the runtime shape requires it rather than inventing packaging decisions early.

## Planning

- [`docs/project/OBJECTIVES.md`](docs/project/OBJECTIVES.md) — what AURA must achieve.
- [`docs/project/GLOSSARY.md`](docs/project/GLOSSARY.md) — shared vocabulary.
- [`docs/architecture/OVERVIEW.md`](docs/architecture/OVERVIEW.md) — accepted architecture.
- [`docs/architecture/FLOW.md`](docs/architecture/FLOW.md) — Polaris ↔ AURA ↔ LLM flow.
- [`docs/roadmap/ROADMAP.md`](docs/roadmap/ROADMAP.md) — phase sequence.
- [`docs/roadmap/IMPLEMENTATION-PLAN.md`](docs/roadmap/IMPLEMENTATION-PLAN.md) — operational step-by-step plan.
- [`docs/research/OPEN-QUESTIONS.md`](docs/research/OPEN-QUESTIONS.md) — questions that require evidence rather than guesses.

## Development workflow

For a clean checkout:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run verify
```

`pnpm run verify` is the single local/CI gate. It currently runs environment/document checks, repository structure verification, architecture boundary checks, strict TypeScript type checking and unit tests.

Before changing code or architecture, read [`AGENTS.md`](AGENTS.md).
