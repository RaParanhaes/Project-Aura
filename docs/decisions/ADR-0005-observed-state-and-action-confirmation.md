# ADR-0005 — Separate observed state from requested actions

**Status:** Accepted

## Context

Networked actions can be delayed, rejected or become ambiguous if the connection fails after sending.

## Decision

World State contains what AURA has observed/confirmed from Polaris. A requested action is tracked separately as pending until confirmation, rejection or reconciliation.

## Consequences

Sending a packet never directly mutates observed state. Side-effecting capabilities must define recovery semantics and must not be blindly retried when outcome is ambiguous.
