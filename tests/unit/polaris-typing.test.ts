import { describe, expect, it, vi } from 'vitest';
import { PolarisTypingAdapter } from '../../packages/polaris/src/index.ts';
import { PacketStreamCodec } from '../../packages/protocol/src/index.ts';
const header = (payload: Uint8Array) => new PacketStreamCodec().push(payload)[0]!.header;
describe('Polaris typing adapter', () => {
  it('emits complete bodyless start and stop packets', async () => {
    const sent: Uint8Array[] = []; const adapter = new PolarisTypingAdapter({ send: vi.fn(async p => { sent.push(p); }) });
    await adapter.start(); await adapter.stop(); expect(sent.map(header)).toEqual([1597, 1474]);
    expect(sent[0]!.byteLength).toBe(6); expect(sent[1]!.byteLength).toBe(6);
  });
});
