# Runtime perception

This folder owns the deterministic boundary between the complete observed `WorldState` and the bounded view available to one resident.

`PerceptionFilter` identifies the resident by the Polaris user id already present in the hydrated room roster, applies a tile radius, orders nearby units deterministically and enforces a maximum result size. It fails closed when the resident is outside a room or absent from the current roster.

Perception contains only Polaris-confirmed observations. It does not infer relationships, importance, intent or action success. `AttentionRanker` consumes this bounded snapshot and applies only explicit, explainable signals: direct interaction, mention, recent interaction and proximity. Ties are stable and the source world revision is retained. It has no model/provider dependency and never receives raw packets.
