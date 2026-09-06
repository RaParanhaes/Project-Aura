import { describe, expect, it } from 'vitest';
import { WorldState } from '../../packages/runtime/src/index.ts';

describe('WorldState', () => {
  it('projects only observed events with monotonic revisions', () => {
    const state = new WorldState();
    expect(state.snapshot.revision).toBe(0);
    expect(state.apply({ kind: 'session_authenticated', observedAt: 10, payload: { sessionResumed: false, roomId: 42 } })).toMatchObject({ revision: 1, roomId: 42, lastObservedAt: 10 });
    expect(state.apply({ kind: 'user_home_room_observed', observedAt: 11, payload: { homeRoom: 7, roomToEnter: 42 } })).toMatchObject({ revision: 2, roomId: 42, homeRoom: 7, lastObservedAt: 11 });
  });

  it('does not change room state for a ping observation', () => {
    const state = new WorldState();
    state.apply({ kind: 'session_authenticated', observedAt: 1, payload: { sessionResumed: false, roomId: 9 } });
    expect(state.apply({ kind: 'server_ping', observedAt: 2, payload: {} })).toMatchObject({ revision: 2, roomId: 9 });
  });

  it('ignores stale observations without advancing the revision', () => {
    const state = new WorldState();
    state.apply({ kind: 'session_authenticated', observedAt: 10, payload: { sessionResumed: false, roomId: 9 } });
    expect(state.apply({ kind: 'session_authenticated', observedAt: 9, payload: { sessionResumed: false, roomId: 2 } })).toMatchObject({ revision: 1, roomId: 9, lastObservedAt: 10 });
  });
});
