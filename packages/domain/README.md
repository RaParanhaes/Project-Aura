# @aura/domain

## Purpose
Stable domain concepts, IDs, invariants and ports shared by AURA modules.

## Owns
Semantic contracts that are independent of Polaris wire details and infrastructure.

## Does not own
WebSockets, packet headers, database implementation, LLM clients or orchestration side effects.

## Dependency direction
Should depend on as little as possible. Infrastructure modules may depend on domain; domain must not import them.
