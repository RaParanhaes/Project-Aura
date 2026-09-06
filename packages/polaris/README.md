# @aura/polaris

## Purpose
Adapter between AURA semantic game operations/events and Polaris protocol/session specifics.

## Owns
Polaris-specific mapping, compatibility quirks and game adapter implementation.

## Current room-entry mapping

`PolarisRoomEntryAdapter` performs the complete two-stage exchange required by Polaris: it sends `RoomEnter` (2312), waits for `RoomOpen` (758), then sends the bodyless room-model request (2300). The final request is what makes Polaris add the Habbo to the room and broadcast `RoomUsers` to occupants.

## Does not own
Agent reasoning, durable memory or generic domain policy.

If Polaris changes while AURA semantics stay stable, prefer adapting here/protocol rather than leaking the change upward.
