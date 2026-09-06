# Project AURA

**AURA — Autonomous User Resident Agents**

Project AURA is an external platform for persistent autonomous residents that connect to a Polaris-based hotel as normal headless users.

AURA is not the game server and is not the renderer:

- **Polaris** remains authoritative for the game world and gameplay rules.
- **Octane** remains the human-facing client/renderer.
- **AURA** manages headless sessions, world projections, agent continuity, capabilities, recovery and, later, cognition/social behavior.
- **LLMs (for example Ollama)** are optional reasoning providers used only when language or higher-level reasoning is needed.

## Current phase

**F0 — Repository Foundation**

The first objective is not to build an AI resident. It is to build a reliable platform that can later support intelligent residents without rewriting the core.

Start with [`docs/CURRENT.md`](docs/CURRENT.md) and [`docs/INDEX.md`](docs/INDEX.md).

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
├── .agents/skills/             # task-specific guidance for coding agents
├── scripts/                    # developer workflow utilities
└── .github/                    # CI and contribution templates
```

Folders intentionally contain small `README.md` files that define ownership and boundaries before implementation grows.

## Foundation target

The first stable foundation must provide typed protocol contracts, real headless sessions, multi-session lifecycle management, world-state projection, internal events, deterministic capabilities, persistence/recovery, structured observability and strong tests.

## Development workflow

```bash
pnpm run doctor
pnpm run preflight -- reconnect
pnpm run verify
```

During early F0 these commands validate repository/tooling structure. They will grow as TypeScript, tests and CI are added.

## Where to read next

- [`AGENTS.md`](AGENTS.md) — rules and navigation for humans/AI coding agents.
- [`docs/CURRENT.md`](docs/CURRENT.md) — what the project is doing now.
- [`docs/INDEX.md`](docs/INDEX.md) — documentation router.
- [`docs/architecture/OVERVIEW.md`](docs/architecture/OVERVIEW.md) — architecture boundaries.
- [`docs/architecture/FLOW.md`](docs/architecture/FLOW.md) — Polaris → AURA → LLM → Polaris flow.
- [`docs/roadmap/FOUNDATION.md`](docs/roadmap/FOUNDATION.md) — F0–F7 foundation roadmap.

Before changing code or architecture, read [`AGENTS.md`](AGENTS.md).
