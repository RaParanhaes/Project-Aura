import { describe, expect, it } from 'vitest';
import { PacketWriter, RoomUnitWalkComposer, createPacketFrame, parseUnitStatus } from '../../packages/protocol/src/index.ts';
import { PolarisWalkAdapter } from '../../packages/polaris/src/index.ts';

describe('UNIT_WALK', () => {
  it('composes the renderer-compatible x/y packet', async () => {
    const packet = new RoomUnitWalkComposer(7, 4).encode();
    expect(Buffer.from(packet).toString('hex')).toBe('0000000a0cf80000000700000004');
    const sent: Uint8Array[] = [];
    await new PolarisWalkAdapter({ send: async payload => { sent.push(payload); } }).walkTo(7, 4);
    expect(Buffer.from(sent[0]!).toString('hex')).toBe('0000000a0cf80000000700000004');
  });

  it('parses a strict movement confirmation with target and posture actions', () => {
    const writer = new PacketWriter().writeInt(1).writeInt(7).writeInt(7).writeInt(4).writeString('0.5').writeInt(2).writeInt(2).writeString('mv 8,5,0.5/sit 0.5');
    const frame = createPacketFrame(1640, writer.toUint8Array());
    expect(parseUnitStatus(frame)[0]).toMatchObject({ id: 7, x: 7, y: 4, target: { x: 8, y: 5, z: 0.5 }, posture: 'sit' });
  });
});
