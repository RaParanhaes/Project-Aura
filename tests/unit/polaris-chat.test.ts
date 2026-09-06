import { describe, expect, it } from 'vitest';
import { PolarisChatAdapter } from '../../packages/polaris/src/index.ts';

describe('PolarisChatAdapter', () => {
  it('encodes room talk', async () => {
    const packets: Uint8Array[] = [];
    await new PolarisChatAdapter({ send: async (payload) => { packets.push(payload); } }).say('oi');
    expect(Array.from(packets[0])).toEqual([0, 0, 0, 12, 5, 34, 0, 2, 111, 105, 0, 0, 0, 0, 0, 0]);
  });

  it('encodes a recipient-prefixed room whisper', async () => {
    const packets: Uint8Array[] = [];
    await new PolarisChatAdapter({ send: async (payload) => { packets.push(payload); } }).whisper('Cabana', 'oi');
    expect(Array.from(packets[0])).toEqual([0, 0, 0, 19, 6, 7, 0, 9, 67, 97, 98, 97, 110, 97, 32, 111, 105, 0, 0, 0, 0, 0, 0]);
  });

  it('encodes room shout', async () => {
    const packets: Uint8Array[] = [];
    await new PolarisChatAdapter({ send: async (payload) => { packets.push(payload); } }).shout('oi');
    expect(Array.from(packets[0])).toEqual([0, 0, 0, 12, 8, 37, 0, 2, 111, 105, 0, 0, 0, 0, 0, 0]);
  });
});
