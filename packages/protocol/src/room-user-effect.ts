import { PacketBodyError, parsePacketBody } from './packet-body.js';
import type { PacketFrame } from './packet-frame.js';
import { FROZEN_PACKET_REGISTRY } from './frozen-packet-registry.js';

const ROOM_USER_EFFECT = FROZEN_PACKET_REGISTRY.requireByName('server_to_client', 'ROOM_USER_EFFECT');

export type RoomUserEffect = { readonly roomUnitId: number; readonly effectId: number; readonly displayData: number };

export function parseRoomUserEffect(frame: PacketFrame): RoomUserEffect {
  return parsePacketBody(frame, ROOM_USER_EFFECT, reader => {
    const roomUnitId = reader.readInt();
    const effectId = reader.readInt();
    const displayData = reader.readInt();
    if (roomUnitId < 0 || effectId < 0 || displayData < 0) throw new PacketBodyError('ROOM_USER_EFFECT', 'effect fields cannot be negative');
    return { roomUnitId, effectId, displayData };
  });
}
