import { describe, expect, it } from 'vitest';
import { RoomHydrator } from '../../packages/runtime/src/index.ts';
import type { DomainEvent } from '../../packages/domain/src/index.ts';

const event = { kind: 'server_ping', observedAt: 1, payload: {} } as DomainEvent;

describe('RoomHydrator', () => {
  it('buffers dependent events until a valid snapshot is ready', () => {
    const hydrator = new RoomHydrator();
    hydrator.begin(42);
    hydrator.buffer(event);
    expect(hydrator.state).toBe('loading');
    expect(hydrator.acceptSnapshot({ roomId: 42, revision: 1 })).toEqual([event]);
    expect(hydrator.state).toBe('ready');
  });

  it('rejects invalid snapshots and prevents hydration from the wrong state', () => {
    const hydrator = new RoomHydrator();
    hydrator.begin(42);
    expect(() => hydrator.acceptSnapshot({ roomId: -1, revision: 1 })).toThrow();
    expect(hydrator.state).toBe('failed');
    expect(() => hydrator.acceptSnapshot({ roomId: 42, revision: 2 })).toThrow();
  });
});
