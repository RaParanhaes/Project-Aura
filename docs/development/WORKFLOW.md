# Project AURA — Development Workflow

This workflow is intentionally lightweight. Its purpose is to make correct work easier for humans and coding agents without adding unnecessary bureaucracy.

## 1. Start from project context

Before substantial work:

1. read `docs/CURRENT.md`;
2. read `docs/INDEX.md` only as a router;
3. read the nearest relevant module `README.md`;
4. read accepted ADRs that govern the area;
5. inspect existing code/tests/research before designing a parallel mechanism.

Do not read the entire repository by default.

## 2. Confirm the task belongs to the current phase

If the requested work belongs to a future phase, do not silently implement it early just because it seems useful.

Examples during Foundation:
- do not add LLM dependencies to solve protocol/session problems;
- do not add memory/social systems before the runtime can operate real sessions;
- do not modify Polaris to make AURA behavior easier unless an accepted ADR explicitly permits it.

## 3. Research before inventing

Before creating a new mechanism:
- search the repository for an existing implementation or contract;
- inspect Polaris contracts/handlers when the task is protocol-specific;
- inspect approved external references when reuse may save work;
- check license/attribution before adapting external code.

Use existing mechanisms when they already own the behavior.

## 4. Make a focused branch

Normal implementation changes should use a focused branch rather than writing directly to `main`.

Suggested patterns:
- `docs/<topic>`
- `feature/<topic>`
- `fix/<topic>`
- `research/<topic>`

Keep unrelated cleanup out of the same change.

## 5. Implement through the correct boundary

Use the repository/module README and accepted architecture to place behavior correctly.

Examples:
- raw packet framing belongs in `packages/protocol`;
- Polaris-specific translation belongs in `packages/polaris`;
- observed hotel state belongs in runtime world state;
- semantic actions belong in capabilities;
- durable continuity belongs behind persistence boundaries;
- AI reasoning must not directly send protocol packets.

If a task does not fit any existing boundary, stop and evaluate whether architecture documentation/ADR needs adjustment before adding a new package.

## 6. Keep state ownership explicit

Never assume a requested action changed the world.

Expected flow:

`request → execute → pending → Polaris observation → confirm/reject/reconcile`

Observed state changes from Polaris evidence, not from local optimism.

## 7. Add evidence with the change

The appropriate validation depends on the task:
- protocol change → fixture/contract test;
- bugfix → focused reproduction test when feasible;
- state-machine/recovery change → lifecycle/recovery test;
- capability → semantic/precondition/confirmation tests;
- architecture change → ADR/documentation update;
- external reuse → `THIRD_PARTY.md` / research update when applicable.

Do not weaken a contract/test merely to make new code pass unless the contract itself is intentionally superseded.

## 8. Run verification

Before claiming completion, run the repository's current verification command:

```bash
pnpm run verify
```

As the project grows, this command becomes the single local gate for typecheck, tests, architecture rules and other checks.

If an environment-dependent check cannot be run, report that limitation explicitly.

## 9. Update live project knowledge only when needed

Update documentation when the change alters:
- accepted architecture;
- compatibility;
- current phase/milestone;
- a durable development procedure;
- known limitations/open questions.

Do not duplicate facts across many documents. Link to the authoritative source instead.

## 10. Pull request discipline

A PR should make it easy to answer:
- what changed;
- what behavior/decision it affects;
- how it was validated;
- what remains unverified.

Do not call work complete, regression-free or ready if required validation was skipped.

## Core principle

**Use reasoning on the actual engineering problem, not on rediscovering where the project keeps its truth.**