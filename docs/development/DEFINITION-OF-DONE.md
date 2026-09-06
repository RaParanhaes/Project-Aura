# Project AURA — Definition of Done

A task is done when it is correct enough to rely on, not merely when code or text exists.

Use the smallest relevant checklist for the type of change. Not every item applies to every task.

## Always required

- The change matches the current project phase and accepted architecture.
- The change is placed in the correct module/boundary.
- No unrelated behavior is bundled into the same task.
- Required documentation is updated without duplicating existing sources of truth.
- The repository verification command passes, or any unavailable check is explicitly reported.
- No known failure is hidden behind a success claim.

## Documentation changes

Done when:
- the document has a clear purpose and authoritative scope;
- it does not contradict accepted ADRs;
- links/routes from `docs/INDEX.md` or `AGENTS.md` are updated when navigation changes;
- research is clearly distinguished from accepted decisions;
- `docs/CURRENT.md` is updated if the active phase/task changed.

## Protocol changes

Done when:
- wire behavior is based on current Polaris evidence/contracts;
- packet fields/order are explicit;
- no magic packet header is scattered outside the protocol layer;
- known fixtures/contract tests pass;
- malformed/edge cases are handled as appropriate;
- compatibility impact is recorded if the supported Polaris target changes.

## RealSession / lifecycle changes

Done when:
- lifecycle transitions are explicit;
- disconnect/reconnect behavior is tested;
- duplicate active-session invariants remain protected;
- timers/sockets/resources are cleaned up correctly;
- failure states are observable in logs/tests.

## WorldState changes

Done when:
- observed state changes only from server evidence;
- pending intent is not mistaken for confirmed state;
- ordering/hydration assumptions are tested or documented;
- stale/unresolvable events fail safely rather than silently corrupting state.

## Capability changes

Done when the capability defines:
- semantic name and input contract;
- preconditions;
- adapter/protocol mapping;
- success confirmation evidence;
- timeout/rejection behavior;
- recovery semantics (retry/reconcile/recalculate/do-not-repeat);
- appropriate tests.

## Persistence / recovery changes

Done when:
- persisted schemas are versioned/validated;
- live resources are not stored as durable state;
- restart/recovery behavior is tested for the affected path;
- ambiguous non-idempotent actions are reconciled instead of blindly repeated.

## External dependency / reused code

Done when:
- the project actually needs the dependency/reuse;
- existing code could not reasonably solve the problem more simply;
- maintenance/fit has been checked;
- license/attribution implications are recorded;
- reuse mode is clear: dependency, adapted, vendored or reference only;
- dependency changes update the committed `pnpm-lock.yaml`, and frozen installation plus the canonical verification gate pass.

## Architecture changes

Done when:
- the reason cannot be solved cleanly within existing boundaries;
- alternatives/trade-offs were considered;
- an ADR records the accepted durable decision;
- dependent docs/module boundaries are updated;
- architecture guards/tests are updated when applicable.

## Completion wording

When reporting a task, distinguish:
- **verified** — checks actually ran and passed;
- **not run** — relevant check could not be executed;
- **remaining risk** — known uncertainty still exists.

Do not use "done" as a substitute for evidence.