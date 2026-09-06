import { describe, expect, it } from 'vitest';
import { EventNormalizer, registerRoomUsersObservation } from '../../packages/runtime/src/index.ts';

describe('RoomUsers observation bridge', () => {
  it('maps protocol roster data into a domain event', () => {
    const normalizer = new EventNormalizer();
    registerRoomUsersObservation(normalizer, () => [{ id: 2, roomUnitId: 11, name: 'octane_test_1_mt', type: 1, x: 5, y: 7 }]);
    expect(normalizer.normalize({ header: 374, body: new Uint8Array() }, 20)).toEqual({
      kind: 'room_users_observed', observedAt: 20,
      payload: { users: [{ id: 2, roomUnitId: 11, name: 'octane_test_1_mt', type: 1, x: 5, y: 7 }] },
    });
  });
});
