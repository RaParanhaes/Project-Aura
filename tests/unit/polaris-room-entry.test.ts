import { describe, expect, it, vi } from 'vitest';
import { PolarisRoomEntryAdapter } from '../../packages/polaris/src/index.ts';
import { PacketStreamCodec } from '../../packages/protocol/src/index.ts';

const decode = (bytes: Uint8Array) => new PacketStreamCodec().push(bytes)[0]!;

describe('Polaris room-entry adapter', () => {
  it('completes the two-stage entry handshake after RoomOpen', async () => {
    const sent: Uint8Array[] = [];
    const adapter = new PolarisRoomEntryAdapter({ send: vi.fn(async (payload) => { sent.push(payload); }) });

    await adapter.enter({ roomId: 1 });
    expect(decode(sent[0]!).header).toBe(2312);

    await expect(adapter.handleInbound({ header: 3928, body: new Uint8Array() })).resolves.toBe(false);
    await expect(adapter.handleInbound({ header: 758, body: new Uint8Array() })).resolves.toBe(true);
    expect(decode(sent[1]!).header).toBe(2300);
    expect(decode(sent[1]!).body).toHaveLength(0);

    await expect(adapter.handleInbound({ header: 758, body: new Uint8Array() })).resolves.toBe(false);
    expect(sent).toHaveLength(2);
  });

  it('rejects concurrent room-entry requests until RoomOpen is consumed', async () => {
    const adapter = new PolarisRoomEntryAdapter({ send: vi.fn(async () => {}) });
    await adapter.enter({ roomId: 1 });
    await expect(adapter.enter({ roomId: 2 })).rejects.toThrow('already pending');
  });
});
