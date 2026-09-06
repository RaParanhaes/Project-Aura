# AURA Documentation Index

Use this page as a router. Do not read every document for every task.

## I want to understand what AURA is

Read in this order:
1. `project/VISION.md`
2. `project/OBJECTIVES.md`
3. `project/PRINCIPLES.md`
4. `project/GLOSSARY.md` when terminology is unclear
5. `architecture/OVERVIEW.md`
6. `architecture/FLOW.md`

## I want to know what to work on now

- `CURRENT.md` — live project phase and current focus.
- `roadmap/ROADMAP.md` — high-level delivery sequence.
- `roadmap/IMPLEMENTATION-PLAN.md` — operational step-by-step plan.

## I am changing architecture

- Read `architecture/OVERVIEW.md` and `architecture/FLOW.md`.
- Read the relevant accepted ADRs in `decisions/`.
- If the change overturns an accepted durable decision, create a new ADR that supersedes the old one rather than silently editing history.
- For a major unresolved design, use an RFC only when discussion is actually needed.

## I am working on protocol / Polaris integration

- `architecture/FLOW.md`
- `reference/COMPATIBILITY.md`
- `research/POLARIS-PROTOCOL-EVIDENCE.md` — confirmed F2.2 wire/session evidence and phase boundaries.
- `research/OPEN-QUESTIONS.md`
- `research/REFERENCES.md`
- `packages/protocol/README.md`
- `packages/polaris/README.md`

## I am working on sessions, world state or capabilities

- `packages/runtime/README.md`
- nearest runtime subfolder `README.md`
- `architecture/FLOW.md`
- `development/DEFINITION-OF-DONE.md`
- `engineering/TEST-COVERAGE.md`

## I am working on post-Foundation perception or attention

- `roadmap/POST-FOUNDATION.md`
- `packages/runtime/src/perception/README.md`
- `architecture/FLOW.md`
- `development/DEFINITION-OF-DONE.md`

## I am working on persistence / recovery

- `packages/persistence/README.md`
- `architecture/FLOW.md`
- relevant accepted ADRs
- `research/OPEN-QUESTIONS.md`
- `development/DEFINITION-OF-DONE.md`

## I am starting any substantial implementation task

- `CURRENT.md`
- `development/WORKFLOW.md`
- relevant module README/ADRs
- `development/DEFINITION-OF-DONE.md`

## I found a useful external project or idea

- Check `research/REFERENCES.md` first to avoid duplicate investigation.
- Record new evidence in `research/` if it may matter later.
- Record reuse/license implications in `THIRD_PARTY.md` when applicable.
- Research does not become project policy until an accepted decision says so.

## I need to know what is still unknown

- `research/OPEN-QUESTIONS.md`

Do not guess material answers that are intentionally listed there; resolve them with evidence.

## Documentation classes

- **Project** — purpose, objectives, principles and vocabulary.
- **Architecture** — accepted system shape and flow.
- **ADR** — durable accepted architectural decision.
- **RFC** — proposal still being evaluated when discussion is necessary.
- **Research** — evidence, references and unresolved questions.
- **Roadmap** — phase order and implementation sequence.
- **Reference** — compatibility/factual contracts.
- **Development** — workflow and completion rules.
- **Engineering** — quality/coverage tracking.

## Authority rule

When documents disagree, follow `AGENTS.md` authority order. Research notes and external references never override accepted AURA decisions.
