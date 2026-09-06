import { describe, expect, it } from 'vitest';
import { EventNormalizer } from '../../packages/runtime/src/index.ts';

describe('EventNormalizer', () => {
  it('normalizes registered packets and ignores unknown headers', () => {
    const normalizer = new EventNormalizer();
    normalizer.register(2491, 'session_authenticated', () => ({ sessionResumed: false, roomId: 1 }));
    expect(normalizer.normalize({ header: 99, body: new Uint8Array() }, 123)).toBeUndefined();
    expect(normalizer.normalize({ header: 2491, body: new Uint8Array() }, 123)).toEqual({
      kind: 'session_authenticated', observedAt: 123, payload: { sessionResumed: false, roomId: 1 }
    });
  });

  it('rejects duplicate decoder registration', () => {
    const normalizer = new EventNormalizer();
    normalizer.register(3928, 'server_ping', () => ({}));
    expect(() => normalizer.register(3928, 'server_ping', () => ({}))).toThrow();
  });
});
