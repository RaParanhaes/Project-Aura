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

## Intended foundation

The first stable foundation must provide typed protocol contracts, real headless sessions, multi-session lifecycle management, world-state projection, internal events, deterministic capabilities, persistence/recovery, structured observability and strong tests.

## Development workflow

```bash
pnpm doctor
pnpm preflight -- reconnect
pnpm verify
```

During early F0 these commands validate repository/tooling structure. They will grow as TypeScript, tests and CI are added.

Before changing code or architecture, read [`AGENTS.md`](AGENTS.md).
