# Runtime / Agent

Owns the minimal runtime identity and continuity of one AURA resident.

## Foundation scope
- agent identity
- runtime status
- current activity reference
- current goal reference
- links to persistent state and active session

## Future extensions
Memory, beliefs, norms, needs, relationships, social behavior and LLM reasoning will integrate through explicit services and ports after the Foundation is stable.

## Does not own
- Polaris protocol bytes
- direct database access
- raw LLM provider calls

## Core invariant
The persistent identity/continuity of an agent must survive recreation of its in-memory runtime objects.
