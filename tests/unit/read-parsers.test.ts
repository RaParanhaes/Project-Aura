import { describe, expect, it } from 'vitest';
import { createPacketFrame } from '../../packages/protocol/src/packet-frame.ts';
import { PacketWriter } from '../../packages/protocol/src/packet-writer.ts';
import { parseCatalogPageRead, parseInventoryBadgesRead, parseInventoryItemsRead, parseUserProfileRead } from '../../packages/protocol/src/index.ts';

describe('bounded Polaris read parsers', () => {
  it('parses profile and badge metadata', () => {
    const p = new PacketWriter().writeInt(7).writeString('AURA').writeString('hd-180-1').writeString('hello').writeString('01-01-2020').writeInt(3).writeInt(2).writeBoolean(false).writeBoolean(false).writeBoolean(true).writeInt(0).writeInt(0).writeBoolean(true).writeInt(1).writeInt(2).writeInt(3).writeInt(4);
    for (let i = 0; i < 7; i++) p.writeString(''); p.writeInt(1);
    expect(parseUserProfileRead(createPacketFrame(3898, p.toUint8Array())).username).toBe('AURA');
    const b = new PacketWriter().writeInt(1).writeInt(9).writeString('ADM').writeInt(1).writeInt(1).writeString('ADM');
    expect(parseInventoryBadgesRead(createPacketFrame(717, b.toUint8Array())).equipped[0]?.code).toBe('ADM');
  });
  it('keeps variable item and catalog payloads bounded and opaque', () => {
    const i = new PacketWriter().writeInt(1).writeInt(0).writeInt(0).writeString('raw');
    expect(parseInventoryItemsRead(createPacketFrame(994, i.toUint8Array())).rawItems.length).toBeGreaterThan(0);
    const empty = new PacketWriter().writeInt(1).writeInt(-1).writeInt(0);
    expect(parseInventoryItemsRead(createPacketFrame(994, empty.toUint8Array())).itemCount).toBe(0);
    const c = new PacketWriter().writeInt(1).writeString('normal').writeString('raw');
    expect(parseCatalogPageRead(createPacketFrame(804, c.toUint8Array())).pageId).toBe(1);
  });
});
