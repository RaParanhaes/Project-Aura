import { describe, expect, it } from 'vitest';
import { WorldState } from '../../packages/runtime/src/index.ts';

describe('observed room users', () => {
  it('projects the roster so adapters can render the users', () => {
    const state = new WorldState();
    state.apply({ kind: 'session_authenticated', observedAt: 1, payload: { sessionResumed: false, roomId: 1 } });
    state.apply({ kind: 'room_users_observed', observedAt: 2, payload: { users: [
      { id: 1, roomUnitId: 10, name: 'Cabana', type: 1, x: 4, y: 7 },
      { id: 2, roomUnitId: 11, name: 'octane_test_1_mt', type: 1, x: 5, y: 7 },
    ] } });
    expect(state.snapshot.users.map((user) => user.name)).toEqual(['Cabana', 'octane_test_1_mt']);
  });
});
