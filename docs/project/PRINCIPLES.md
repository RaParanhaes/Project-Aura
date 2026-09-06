# AURA Engineering Principles

## 1. Polaris is authoritative

AURA observes and acts; Polaris validates the actual game state.

## 2. Continuity belongs to AURA

Identity, goals, durable progress and later memories/relationships must survive session/process failures independently of Polaris runtime memory.

## 3. Observed state is not desired state

Sending `walk`, `buy`, `enter room` or any other action creates a pending intent. World state changes only after observation/reconciliation.

## 4. Perfect headless user before intelligent agent

Foundation proves protocol/session/world/capabilities/recovery before Ollama or social intelligence.

## 5. Fast path before cognition

Mechanical behavior is deterministic. Reusable procedures become skills. LLM reasoning is reserved for ambiguity, language and high-level planning.

## 6. Make the correct path the easiest path

Architecture rules should be executable through schemas, tests and CI wherever practical, not merely prose.

## 7. One source of truth

Generate reference documentation from machine-readable contracts when possible. Do not maintain duplicate live bug/task lists in Markdown and GitHub Issues.

## 8. Progressive disclosure for coding agents

Keep `AGENTS.md` small. Task-specific knowledge lives in module docs/skills and is loaded only when relevant.

## 9. Reuse before reimplementation

Prefer mature focused dependencies or compatible open-source implementations. Record whether code is a dependency, adapted, vendored or reference-only and verify license implications.

## 10. Credible over optimal

Future residents should not automatically agree with authority, know everything, react instantly or always choose the optimal action. Human realism is a later layer built on reliable infrastructure.
