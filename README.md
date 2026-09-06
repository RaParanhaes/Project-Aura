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
**F1 — Development Foundation: IN PROGRESS**  
**F1.1 — Runtime / Workspace Baseline: COMPLETE**  
**Next: F1.2 — Test Baseline**

The repository now has a strict TypeScript workspace baseline validated in CI, while protocol/session/gameplay/AI implementation remains intentionally untouched.

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

Each existing app/package is now a pnpm workspace project with its own `package.json`, `tsconfig.json` and minimal TypeScript public surface. The actual feature implementations are introduced only in their planned phases.

## Planning

- [`docs/project/OBJECTIVES.md`](docs/project/OBJECTIVES.md) — what AURA must achieve.
- [`docs/project/GLOSSARY.md`](docs/project/GLOSSARY.md) — shared vocabulary.
- [`docs/architecture/OVERVIEW.md`](docs/architecture/OVERVIEW.md) — accepted architecture.
- [`docs/architecture/FLOW.md`](docs/architecture/FLOW.md) — Polaris ↔ AURA ↔ LLM flow.
- [`docs/roadmap/ROADMAP.md`](docs/roadmap/ROADMAP.md) — phase sequence.
- [`docs/roadmap/IMPLEMENTATION-PLAN.md`](docs/roadmap/IMPLEMENTATION-PLAN.md) — operational step-by-step plan.
- [`docs/research/OPEN-QUESTIONS.md`](docs/research/OPEN-QUESTIONS.md) — questions that require evidence rather than guesses.

## Development workflow

```bash
corepack enable
pnpm install
pnpm run doctor
pnpm run verify
```

`pnpm run verify` currently checks required repository artifacts and strict TypeScript compilation across the workspace. More checks are added only when their corresponding F1 milestones are implemented.

Before changing code or architecture, read [`AGENTS.md`](AGENTS.md).
