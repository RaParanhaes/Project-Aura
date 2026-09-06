import { describe, expect, it } from 'vitest';
import type { WorldStateSnapshot } from '../../packages/domain/src/index.ts';
import { AttentionRanker, PerceptionFilter } from '../../packages/runtime/src/index.ts';

const world = (): WorldStateSnapshot => ({
  revision: 9, roomId: 1, homeRoom: 1, lastObservedAt: 200,
  users: [
    { id: 1, roomUnitId: 10, name: 'self', type: 1, x: 4, y: 4 },
    { id: 2, roomUnitId: 20, name: 'near', type: 1, x: 5, y: 4 },
    { id: 3, roomUnitId: 30, name: 'far', type: 1, x: 7, y: 4 },
  ],
});

describe('AttentionRanker', () => {
  it('prioritizes explicit interaction over proximity and explains the result', () => {
    const perception = new PerceptionFilter({ radius: 4 }).project(world(), 1);
    const snapshot = new AttentionRanker({ maxFocuses: 2 }).rank(perception, [{ userId: 3, directInteraction: true }]);
    expect(snapshot).toMatchObject({ status: 'ready', sourceRevision: 9 });
    expect(snapshot.focuses.map(focus => focus.user.name)).toEqual(['far', 'near']);
    expect(snapshot.focuses[0]?.reasons).toEqual(['direct_interaction', 'proximity']);
  });

  it('is stable for equal scores and retains the source revision', () => {
    const base = world();
    const perception = new PerceptionFilter({ radius: 4 }).project({ ...base, users: [...base.users, { id: 4, roomUnitId: 15, name: 'tie', type: 1, x: 5, y: 4 }] }, 1);
    const ranker = new AttentionRanker();
    const first = ranker.rank(perception);
    expect(first).toEqual(ranker.rank(perception));
    expect(first.sourceRevision).toBe(9);
    expect(first.focuses.map(focus => focus.user.name)).toEqual(['tie', 'near', 'far']);
  });

  it('fails safely for incomplete or stale perception', () => {
    const ranker = new AttentionRanker();
    const base = world();
    const absent = new PerceptionFilter().project({ ...base, users: [] }, 1);
    expect(ranker.rank(absent)).toMatchObject({ status: 'no_perception', focuses: [] });
    const ready = new PerceptionFilter().project(base, 1);
    expect(ranker.rank(ready, [], { expectedSourceRevision: 8 })).toMatchObject({ status: 'stale', focuses: [] });
  });
});
