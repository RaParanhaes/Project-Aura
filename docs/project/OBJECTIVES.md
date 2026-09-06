# Project AURA — Objectives

## Primary objective

Build a reliable external platform that can operate persistent autonomous residents in a Polaris-based hotel through normal authenticated headless user sessions.

AURA must make it possible to add cognition, memory, social behavior and local LLM reasoning later without rewriting the platform core.

## Foundation objectives

Before advanced AI behavior, AURA must be able to:

1. connect a real account to Polaris without running Octane or a browser;
2. maintain and recover multiple authenticated sessions;
3. decode Polaris events into stable internal domain events;
4. maintain an observed world-state projection based on Polaris-confirmed data;
5. expose gameplay through semantic capabilities instead of raw packets;
6. distinguish requested actions from confirmed world state;
7. persist agent continuity independently from transient Polaris sessions;
8. provide structured logs, traces and tests that explain what happened;
9. scale progressively from 1 to approximately 30 residents;
10. remain understandable and changeable by humans and coding agents.

## Long-term product objectives

After the Foundation is stable, AURA should support residents that can:

- maintain persistent identities, routines, goals and relationships;
- converse naturally with humans and other residents;
- move, visit rooms, follow users and interact with the world;
- use catalog, inventory, furniture, friendship and trade capabilities;
- learn or reuse validated skills;
- remember relevant experiences without becoming omniscient;
- participate in group conversations with believable timing and attention;
- make higher-level decisions using a shared local LLM only when needed;
- continue their lives across AURA or Polaris restarts.

## Engineering objectives

AURA should favor:

- a modular monolith before distributed services;
- Ports & Adapters at real external boundaries;
- typed and versioned contracts;
- deterministic execution for known procedures;
- event-driven state updates;
- explicit recovery semantics;
- progressive disclosure in documentation for coding agents;
- reuse of mature open-source components when licensing and fit are appropriate.

## Success criteria for the first stable Foundation

The Foundation is not considered stable until AURA can demonstrate, through repeatable tests, that multiple real headless users can connect to Polaris, enter rooms, observe users, move, type, speak, recover from connection loss and return to a coherent operational state without AI-specific changes to Polaris.

## Non-objective of the Foundation

The Foundation does not need to prove human-like intelligence. Its job is to make later intelligence safe to add.