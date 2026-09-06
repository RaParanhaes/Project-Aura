# Project AURA — Glossary

This glossary defines project terms so humans and coding agents use the same language.

## AURA

**Autonomous User Resident Agents.** The external platform that manages headless residents, runtime state, recovery, capabilities and later cognition/social behavior.

## Polaris

The authoritative game server/emulator. Polaris validates gameplay and owns the current truth of the hotel world.

## Octane

The human-facing game client/renderer. AURA residents must not require one Octane/browser instance per agent.

## Resident / Agent

A persistent AURA-controlled hotel user with identity and continuity. A resident is represented to Polaris as a normal authenticated user session.

## RealSession

The AURA abstraction for one real authenticated headless game session connected through the normal Polaris protocol.

## SessionManager

The runtime component responsible for lifecycle, health and coordination of multiple RealSessions.

## Protocol SDK

The low-level package responsible for packet framing, field encoding/decoding, packet contracts and wire compatibility. It does not decide behavior.

## PolarisAdapter

The Polaris-specific implementation of AURA's game-facing boundary. It translates semantic operations/events between AURA and the Polaris protocol.

## WorldState

AURA's current projection of Polaris-confirmed world data, such as room, users, positions, statuses and visible objects. WorldState is rebuildable and is not long-term memory.

## Observed State

State confirmed through events received from Polaris.

## Desired State

A state AURA is trying to reach through one or more actions. Desired state must never be confused with observed state.

## Domain Event

A stable internal event representing meaning rather than a raw packet, for example `USER_ENTERED_ROOM` or `CHAT_RECEIVED`.

## Capability

A semantic action the game permits AURA to execute, such as `WALK_TO`, `SAY`, `LOOK_AT` or `ENTER_ROOM`.

## Skill

A reusable validated procedure composed from capabilities. A skill describes how to achieve something; it is not the same as a capability.

## Goal

A desired future state or outcome for an agent.

## Habit

A mostly automatic recurring response or behavior that can execute without high-level reasoning when conditions match.

## AgentRuntime

The live runtime representation that combines an agent's persistent state with temporary services such as session, world view and event subscriptions.

## AgentState

Durable continuity owned by AURA, such as identity, persistent goal state and later memories/relationships. It must be versioned.

## ActionJournal

The record of actions that AURA attempted and their status, such as pending, confirmed, rejected or ambiguous.

## Recovery Semantics

Rules defining how a capability should behave after failure or ambiguous execution: retry, reconcile, recalculate or never repeat blindly.

## Room Hydration

The process of collecting enough room data from Polaris to make the local WorldState coherent after entering/changing rooms.

## Fast Path

A deterministic path for mechanical behavior that does not require an LLM.

## Skill Path

Execution of a known reusable procedure, normally without an LLM for each micro-action.

## Cognitive Path

The path used when interpretation, ambiguous planning, language or higher-level reasoning is required.

## LLM / Ollama

An optional reasoning provider. Ollama is the planned local provider, but AURA must not make the Foundation depend on a specific model/provider.

## Decision Proposal

A structured result produced by a reasoning component. It is a proposal and must pass AURA validation before execution.

## World Revision

A monotonically changing revision identifier used to detect whether a decision was based on stale world context.

## ADR

Architecture Decision Record. A durable record of an accepted architectural decision and its consequences.

## RFC

Request for Comments. A proposal under evaluation. An RFC is not an accepted requirement until a decision is made.

## Research Note

Evidence or inspiration from external sources. Research does not override accepted AURA decisions.