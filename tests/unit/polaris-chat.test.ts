import { describe, expect, it } from 'vitest';
import { PolarisChatAdapter } from '../../packages/polaris/src/index.ts';
describe('PolarisChatAdapter', () => { it('encodes room talk', async () => { const packets: Uint8Array[] = []; await new PolarisChatAdapter({ send: async (payload) => { packets.push(payload); } }).say('oi'); expect(Array.from(packets[0])).toEqual([0, 0, 0, 12, 5, 34, 0, 2, 111, 105, 0, 0, 0, 0, 0, 0]); }); });
