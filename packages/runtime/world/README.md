# Runtime / World

Owns AURA's observed projection of the current Polaris world.

## Owns
- room state
- visible users and room units
- positions and rotations
- relevant room content state
- room hydration/readiness
- world revisions

## Does not own
- long-term memory
- desired/pending actions
- protocol byte layout
- AI reasoning

## Core invariant
`WorldState` changes from observations confirmed by Polaris, not merely because AURA requested an action.
