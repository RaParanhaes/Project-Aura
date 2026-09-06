# @aura/polaris

## Purpose
Adapter between AURA semantic game operations/events and Polaris protocol/session specifics.

## Owns
Polaris-specific mapping, compatibility quirks and game adapter implementation.

## Does not own
Agent reasoning, durable memory or generic domain policy.

If Polaris changes while AURA semantics stay stable, prefer adapting here/protocol rather than leaking the change upward.
