# AURA Foundation — Completion Gate

This document defines **what must be true for the AURA Foundation to be considered stable**.

It intentionally does not duplicate phase numbering. Use:
- `ROADMAP.md` for the phase-level sequence;
- `IMPLEMENTATION-PLAN.md` for the step-by-step implementation order.

## Foundation purpose

The Foundation is the non-AI platform that lets AURA operate real headless residents reliably through the normal Polaris protocol.

It must be useful without Ollama, long-term memory, social intelligence or other future cognition layers.

## Required capabilities

Before declaring **AURA FOUNDATION STABLE**, AURA must prove that it can:

- authenticate a real headless user account;
- maintain a coherent RealSession lifecycle;
- enter/change rooms;
- hydrate enough room state to safely resolve users/events;
- observe room users and their relevant current state;
- walk and confirm resulting position from Polaris observations;
- look/turn;
- start typing, speak and stop typing through normal protocol capabilities;
- distinguish pending actions from confirmed world state;
- disconnect and reconnect without duplicate active sessions;
- preserve meaningful agent continuity across AURA process restart;
- rebuild transient world state from Polaris rather than treating old snapshots as truth;
- recover/reconcile after relevant Polaris/AURA failures;
- operate multiple sessions concurrently and progressively validate the target scale;
- explain failures through structured diagnostics/tests.

## Required evidence

Foundation acceptance requires repeatable evidence, not only implementation presence.

Required evidence includes:
- protocol/contract fixtures for critical packets;
- integration tests against the supported Polaris target;
- golden scenario tests;
- recovery scenarios;
- multi-session/load evidence;
- current compatibility record;
- documented known limitations;
- architecture/documentation audit.

## Primary golden scenario

A representative resident should be able to:

`connect → authenticate → enter room → observe another user → walk → start typing → say → stop typing → lose connection → recover → return operational`

The exact scenario may expand as Foundation capabilities mature.

## Explicitly not required for Foundation stability

- Ollama or another LLM provider;
- long-term episodic/semantic memory;
- social relationship engine;
- group conversation coordination;
- needs/beliefs/norms;
- economy intelligence;
- autonomous room decoration/planning;
- human-realism tuning.

Those systems are built **on top of** a stable Foundation.

## Gate rule

Do not declare Foundation stable while a required scenario is only assumed, manually demonstrated once, or lacks a reproducible validation path.