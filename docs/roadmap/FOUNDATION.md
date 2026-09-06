# AURA Foundation Roadmap

The Foundation ends when AURA can reliably operate real headless users without any LLM dependency.

## F0 — Repository Foundation

- [x] Repository initialized.
- [x] Documentation hierarchy established.
- [x] Architecture direction documented.
- [x] ADR process bootstrapped.
- [x] Minimal doctor/preflight/verify commands added.
- [ ] TypeScript strict workspace added.
- [ ] CI added.
- [ ] Architecture dependency guards added.
- [ ] Issue/PR templates added.
- [ ] Initial coding-agent skills added.

## F1 — Protocol Foundation

- packet framing/codec;
- typed headers/contracts;
- fixtures from supported Polaris version;
- contract tests;
- property-based codec tests;
- upstream contract comparison strategy.

## F2 — RealSession

- WebSocket lifecycle;
- release/machine handshake;
- authentication/SSO abstraction;
- heartbeat;
- clean disconnect;
- reconnect/session-resume handling.

## F3 — World State

- room lifecycle/hydration;
- room users;
- positions/rotations/status;
- ordered chat/typing events;
- current observed room state.

## F4 — Deterministic Capabilities

- enter room;
- walk;
- look/turn;
- start typing;
- stop typing;
- say;
- capability preconditions/results.

## F5 — Persistence & Recovery

- versioned agent state;
- checkpoints;
- restart recovery;
- action journal;
- capability recovery semantics;
- reconciliation after ambiguous failures.

## F6 — Multi-session

Validate 1 → 4 → 10 → 20 → 30 real sessions with health/reconnect behavior and bounded resource usage.

## F7 — Foundation Validation

- Golden Scenarios;
- recovery suite;
- load suite;
- architecture/documentation audit;
- compatibility snapshot.

## Foundation completion gate

AURA Foundation is stable only after a real account can authenticate, enter a room, observe users, walk, look, type, speak, disconnect/reconnect and recover in repeatable tests — with no Ollama required.
