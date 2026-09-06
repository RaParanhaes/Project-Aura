# Runtime perception

This folder owns the deterministic boundary between the complete observed `WorldState` and the bounded view available to one resident.

`PerceptionFilter` identifies the resident by the Polaris user id already present in the hydrated room roster, applies a tile radius, orders nearby units deterministically and enforces a maximum result size. It fails closed when the resident is outside a room or absent from the current roster.

Perception contains only Polaris-confirmed observations. It does not infer relationships, importance, intent or action success. Attention ranking is the next layer and must consume this bounded snapshot rather than the complete world dump.
