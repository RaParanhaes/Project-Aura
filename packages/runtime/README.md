# @aura/runtime

## Purpose
Run active residents and coordinate sessions, events, world projection and capabilities.

## Initial responsibilities
- RealSession lifecycle;
- SessionManager;
- EventBus;
- Room hydration/world projection;
- AgentRuntime durable-state attachment;
- Capability registry/planning/execution;
- pending action tracking/reconciliation.

## Foundation invariants
- At most one active authenticated RealSession per agent identity.
- Observed WorldState changes from Polaris observations, not requested actions.
- Foundation runtime has no LLM dependency.
- Live resources (socket/timers) are not durable AgentState.
