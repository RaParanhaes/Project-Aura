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
**Current phase: F8 — Foundation Validation**
**F2.1 — Freeze Compatibility Target: COMPLETE**  
**F2.2 — Study Existing Implementation Evidence: COMPLETE**  
**F2.3 — Packet Primitives: COMPLETE**  
**F2.4 — Registry and Contracts: COMPLETE**
**F2.5 — Initial Packets: COMPLETE**
**F2.6 — Fixtures and Tests: COMPLETE**
**F3.1 — Session Lifecycle Model: COMPLETE**
**F3.2 — Transport: COMPLETE**
**F3.3 — Authentication Boundary: COMPLETE**
**F3.4 — First Real Login: COMPLETE**
**F3.5 — Disconnect/Reconnect: COMPLETE**
**F4.1 — Event Normalization: COMPLETE**
**F4.2 — Room Hydration: COMPLETE**
**F4.3 — Observed WorldState: COMPLETE**
**F4.4 — State Rules: COMPLETE**
**F5 — Capabilities: COMPLETE**
**F6 — Persistence and Continuity: COMPLETE**
**F7 — Multi-session Validation: COMPLETE**
**F8.1 — Golden Scenario Audit: COMPLETE**
**F8.2 — WALK_TO Wire Validation: COMPLETE**
**F8.3 — Reconnect and Session Recovery: COMPLETE**
**F8.4 — Polaris Restart Reconciliation: COMPLETE**
**F8.5 — Complete Golden Scenario and Foundation Gate: COMPLETE**
**Foundation status: STABLE**
**P1.1 — Resident-relative Perception: COMPLETE**
**P1.2 — Deterministic Attention Ranking: COMPLETE**
**P1.3 — Perception Event Window: COMPLETE**
**Current phase: P1 — Perception and Attention**
**Next milestone: P1.4 — Live Shared-Room Validation**

The protocol package now has strict wire primitives, a direction-aware registry, concrete composers/parsers for handshake, authentication, keepalive, room entry, chat and movement packets, and frozen byte fixtures with contract tests. Runtime now has session lifecycle, transport, authentication, reconnect recovery, event normalization, room hydration barriers, an observed WorldState projection with stale-event protection, persistence checkpoints and a semantic capability boundary. Live validation covers room visibility, movement confirmation, chat, multi-session operation and recovery after a controlled Polaris restart.

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

A JavaScript `dist/` build is intentionally not emitted yet. The workspaces remain private development surfaces; the executable `aura-core` composition runs directly through the workspace TypeScript loader for local validation.

## Planning

- [`docs/project/OBJECTIVES.md`](docs/project/OBJECTIVES.md) — what AURA must achieve.
- [`docs/project/GLOSSARY.md`](docs/project/GLOSSARY.md) — shared vocabulary.
- [`docs/architecture/OVERVIEW.md`](docs/architecture/OVERVIEW.md) — accepted architecture.
- [`docs/architecture/FLOW.md`](docs/architecture/FLOW.md) — Polaris ↔ AURA ↔ LLM flow.
- [`docs/roadmap/ROADMAP.md`](docs/roadmap/ROADMAP.md) — phase sequence.
- [`docs/roadmap/IMPLEMENTATION-PLAN.md`](docs/roadmap/IMPLEMENTATION-PLAN.md) — operational step-by-step plan.
- [`docs/research/POLARIS-PROTOCOL-EVIDENCE.md`](docs/research/POLARIS-PROTOCOL-EVIDENCE.md) — F2.2 confirmed wire/protocol evidence and phase boundaries.
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
