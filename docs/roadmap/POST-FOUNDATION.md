# Post-Foundation product plan

Foundation stability is the starting point for resident behavior. Product layers must continue to consume confirmed runtime state and invoke semantic capabilities; they do not bypass the protocol, Polaris authority or action confirmation boundaries.

## P1 — Perception and attention

Goal: give each resident a bounded, current and explainable view of the shared room, then select what deserves attention without requiring an LLM.

### P1.1 — Resident-relative perception

- project one resident's perception from a `WorldStateSnapshot`;
- require the resident to be confirmed in the current room roster;
- filter nearby units by tile radius and result capacity;
- preserve the source world revision and deterministic ordering;
- fail closed when room/self context is incomplete.

**Done when:** unit tests prove bounded filtering, stable ordering, truncation and incomplete-context behavior. **Status: COMPLETE.**

### P1.2 — Deterministic attention ranking

- rank perceived units using explicit signals such as proximity and direct interaction;
- keep scoring inspectable and independent of any model provider;
- apply stable tie-breaking and a bounded focus set;
- retain the source perception/world revision.

**Done when:** the same perception always produces the same ranked focus set and invalid/stale inputs fail safely. **Status: COMPLETE.**

### P1.3 — Perception event window

- combine room roster, movement, typing and chat observations into a bounded recent window;
- preserve ordered social events while coalescing replaceable position updates;
- keep untrusted chat text as data;
- expose enough evidence to explain why attention changed.

**Done when:** tests cover ordering, coalescing, expiration and untrusted text handling. **Status: COMPLETE.**

### P1.4 — Live shared-room validation

- run two AURA residents with Cabana in AAA;
- confirm each resident sees a distinct resident-relative snapshot;
- exercise movement, typing and speech observations;
- verify attention changes from observed evidence and remains stable across reconnect.

**P1 done when:** perception and attention operate repeatably in the local Polaris room without an LLM and without accessing raw packets or the complete world outside their runtime boundary.

## Later layers

Goals/activities, skills/habits, social/group conversation, memory/knowledge, shared LLM gateway, human realism and extended economy/gameplay remain sequenced after P1. Their detailed contracts will be written from evidence gathered in the preceding layer.
