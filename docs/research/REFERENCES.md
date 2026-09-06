# Project AURA — External References

This catalog records projects and ideas that informed AURA. A reference is evidence or inspiration; it is not an AURA requirement by itself.

## Reuse labels

- **DEPENDENCY** — consumed as a library/package.
- **ADAPTED** — selected implementation ideas/code may be adapted with license compliance.
- **REFERENCE** — architecture/behavior inspiration only.
- **RESEARCH** — useful but not yet accepted for AURA.

## Polaris Emulator

Repository: `duckietm/Polaris-Emulator`

Use in AURA:
- authoritative server/runtime target;
- machine-readable packet contracts;
- packet handlers and integration behavior;
- session resume/recovery evidence;
- development/fixture/contract discipline.

AURA rule: Polaris remains authoritative and is not modified for AI behavior unless an accepted ADR changes that decision.

Classification: **REFERENCE + EXTERNAL RUNTIME TARGET**

## cayank/packet-client

Repository: `cayank/packet-client`

Useful evidence:
- TypeScript WebSocket client without browser rendering;
- normal SSO/session flow;
- packet framing and selected room/user parsers;
- movement/chat/friend behaviors;
- buffering room chat until room-user identity mapping exists.

F2.2 reviewed it against the frozen local Polaris/Octane evidence. Its concepts are useful, but it is not the protocol authority and AURA must not inherit packet IDs or compatibility assumptions without reconciliation against the frozen target.

Known license: ISC.

Current reuse decision: reference only; no dependency, vendoring or copied source. Any later source adaptation requires an explicit reuse-mode update and attribution review.

Classification: **REFERENCE**

## Gurkengewuerz/nitro-ai-agent

Useful evidence:
- browserless hotel client;
- movement, chat, follow and room actions.

License is more restrictive for our reuse goals, so use mainly as reference unless obligations are deliberately accepted.

Classification: **REFERENCE**

## AgentSociety 2

Useful ideas:
- persistent agent data separate from runtime services;
- episodic memory separated from long-term summaries;
- skill catalog with lazy loading;
- centralized LLM dispatcher;
- traceability of agent, environment and LLM activity.

Classification: **REFERENCE**

## AI Town

Useful ideas:
- realtime social state machines;
- conversation membership and movement toward partners;
- typing/wait timing;
- asynchronous operations and conversational cooldowns;
- lesson from memory/prompt-injection risks: world/user text must remain untrusted data.

AURA does not inherit AI Town's exact-two-member conversation limitation.

Classification: **REFERENCE**

## Google DeepMind Concordia

Useful ideas:
- modular cognitive components;
- separation between agent action proposal and environment/world resolution;
- observation → action → resolution framing.

Classification: **REFERENCE**

## OASIS

Useful ideas:
- explicit action catalogs;
- social graph concepts;
- separation between deterministic/manual actions and model-driven choices.

Classification: **REFERENCE**

## TinyTroupe

Useful ideas:
- imperfect and heterogeneous simulated people;
- persona/environment separation;
- memory distinctions;
- emphasis on believable rather than optimal simulated behavior.

Classification: **REFERENCE**

## SOTOPIA / Lifelong SOTOPIA

Useful mainly for future evaluation:
- social interaction scenarios;
- persona consistency;
- multi-turn/multi-party evaluation;
- long-history degradation concerns.

Classification: **RESEARCH / FUTURE EVALUATION**

## Generative Agents

Useful ideas:
- memory stream;
- retrieval;
- reflection;
- planning;
- emergent social behavior.

Classification: **REFERENCE**

## Voyager

Useful ideas:
- reusable compositional skill libraries.

AURA difference: skills should remain declarative/validated over approved capabilities; do not permit arbitrary LLM-generated executable code.

Classification: **REFERENCE**

## Temporal

Useful ideas for Foundation engineering:
- durable execution concepts;
- action histories;
- idempotency/reconciliation after ambiguous failures.

Decision: do not introduce Temporal itself in the Foundation unless a demonstrated need appears.

Classification: **REFERENCE**

## XState

Useful candidate for explicit lifecycle/state-machine implementation such as sessions and recovery.

Decision status: implementation choice to validate during Development Foundation; do not treat as required before F1 evidence.

Classification: **DEPENDENCY CANDIDATE**

## Zod

Useful candidate for typed runtime validation, versioned event/state contracts and later structured LLM outputs.

Classification: **DEPENDENCY CANDIDATE**

## Documentation / engineering references

The project also draws process inspiration from:
- AGENTS.md conventions for coding-agent navigation;
- OpenHands progressive disclosure / task-specific skills;
- Cloudflare Agents test-coverage and repository guidance patterns;
- ADR practices for durable decisions;
- C4's preference for simple context/container architecture diagrams before deep component diagrams.

AURA deliberately adopts the principles without copying the scale or documentation volume of large repositories.
