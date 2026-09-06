import { describe, expect, it } from 'vitest';
import type { ObservedRoomUser, WorldStateSnapshot } from '../../packages/domain/src/index.ts';
import { PerceptionFilter } from '../../packages/runtime/src/index.ts';

const user = (id: number, roomUnitId: number, x: number, y: number, name = `user-${id}`): ObservedRoomUser =>
  ({ id, roomUnitId, name, type: 1, x, y });

const world = (users: readonly ObservedRoomUser[], roomId: number | undefined = 1): WorldStateSnapshot => ({
  revision: 7,
  roomId,
  homeRoom: 1,
  lastObservedAt: 100,
  users,
});

describe('PerceptionFilter', () => {
  it('projects a bounded resident-relative view in deterministic distance order', () => {
    const filter = new PerceptionFilter({ radius: 3, maxUsers: 2 });
    const snapshot = filter.project(world([
      user(1, 10, 4, 4, 'self'),
      user(2, 30, 6, 5, 'second'),
      user(3, 20, 3, 4, 'nearest'),
      user(4, 40, 9, 9, 'outside'),
      user(5, 15, 6, 4, 'first-at-same-distance'),
    ]), 1);

    expect(snapshot).toMatchObject({ status: 'ready', sourceRevision: 7, roomId: 1, truncated: true });
    expect(snapshot.self?.name).toBe('self');
    expect(snapshot.nearbyUsers.map(entry => [entry.user.name, entry.distance])).toEqual([
      ['nearest', 1],
      ['first-at-same-distance', 2],
    ]);
  });

  it('fails closed until the resident is confirmed in a hydrated room roster', () => {
    const filter = new PerceptionFilter();
    expect(filter.project(world([user(2, 20, 2, 2)]), 1)).toMatchObject({ status: 'self_not_observed', nearbyUsers: [] });
    expect(filter.project({ ...world([]), roomId: undefined }, 1)).toMatchObject({ status: 'outside_room', nearbyUsers: [] });
  });

  it('rejects invalid bounds and resident identities', () => {
    expect(() => new PerceptionFilter({ radius: -1 })).toThrow(/radius/i);
    expect(() => new PerceptionFilter({ maxUsers: 0 })).toThrow(/maxUsers/i);
    expect(() => new PerceptionFilter().project(world([]), 0)).toThrow(/selfUserId/i);
  });
});
