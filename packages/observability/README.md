# @aura/observability

## Purpose

Structured diagnostics for sessions, events, actions, recovery and later AI calls.

Initial target is structured JSON logs with IDs that allow a chain such as:

`Polaris event → perception/decision → capability → packet → confirmation`.

Observability must not become a source of game truth or agent state.

## F1.4 baseline

The public entry point exposes:

- `createLogger(...)` — creates a root Pino logger for an AURA service;
- `withLogContext(...)` — creates a child logger carrying correlation context;
- `AuraLogContext` — optional `traceId`, `sessionId`, `agentId`, `actionId` and `component` fields;
- automatic redaction of common credential fields before logs reach their destination.

Runtime/application code should use this package rather than creating independent logging conventions or ad-hoc `console.*` calls.

The context fields are intentionally optional because not every early lifecycle event has a session, agent, action or trace yet.
