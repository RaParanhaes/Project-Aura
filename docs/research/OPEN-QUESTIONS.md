# Project AURA — Open Questions

This file tracks unresolved questions that can materially affect implementation. Do not silently guess answers in code; resolve them with evidence and then update the relevant architecture/ADR/reference document.

## Compatibility / stack

- What exact Polaris commit/version will be the first official AURA compatibility target?
- What exact Octane build/version is paired with that Polaris target?
- What CMS/auth flow currently produces the SSO token used by the working local stack?
- Is `cayank/packet-client` wire-compatible with the exact Polaris/Octane stack without patching?
- Which protocol contracts/headers differ between upstream Polaris and the user's running version, if any?

## RealSession / transport

- What is the exact login/handshake sequence required by the current stack?
- Which keepalive messages are mandatory versus optional?
- Which disconnect cases are cleanly resumable through Polaris native session recovery?
- What grace/recovery timing should AURA use around Polaris-native resume?
- How should duplicate/ghost session protection be detected and resolved?

## Room hydration / world state

- Which minimum packet set is sufficient to declare `ROOM_CORE_READY`?
- Which events must be buffered until room-unit identity mapping is available?
- Which state is reliable to rebuild from Polaris after reconnect versus only transient UI state?
- How should world revision be incremented: every normalized event or only decision-relevant state changes?

## Persistence / recovery

- What persistence adapter should be used first: SQLite is a strong candidate, but confirm after actual write/load patterns are known.
- Which runtime state belongs in checkpoints versus should always be rebuilt?
- Which initial capabilities are safe to retry, require reconciliation, or must never be repeated blindly?
- What recovery policy should apply when AURA restarts while Polaris remains online?
- What recovery policy should apply when Polaris restarts while AURA remains online?

## Scale

- What are CPU/memory/socket costs per RealSession on the target machine?
- Is one Node process sufficient for ~30 residents with the chosen event and LLM concurrency model?
- What rate limits or anti-spam rules does the actual Polaris deployment enforce?

## Future cognition / LLM

These are intentionally deferred until Foundation evidence exists:

- Which local Ollama model best balances latency, memory and social-language quality on the target hardware?
- What maximum shared LLM concurrency is practical?
- Which read-only tools should the model receive first?
- What structured DecisionProposal schema is sufficient without over-constraining behavior?
- What memory retrieval architecture best supports non-omniscient, source-aware social knowledge?
- How should group conversations coordinate multiple agents without producing synchronized chatbot responses?

## Process rule

When an open question is resolved:
1. record the evidence in research/reference docs if useful;
2. create or update an ADR if it changes an architectural decision;
3. remove the question from this file or mark it resolved with a pointer to the authoritative source.