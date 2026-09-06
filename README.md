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
**Next: F1 — Development Foundation**

The repository now records the accepted project direction, architecture, implementation sequence, open questions and development rules so future work does not depend on chat history.

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
│   └── aura-core/              # executable AURA application
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

Folders intentionally contain small `README.md` files that define ownership and boundaries before implementation grows.

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
pnpm run doctor
pnpm run preflight -- reconnect
pnpm run verify
```

These commands currently support the repository bootstrap and will grow with the implementation phases.

Before changing code or architecture, read [`AGENTS.md`](AGENTS.md).