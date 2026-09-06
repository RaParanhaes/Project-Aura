import { PacketReader } from './packet-reader.js';
import { PacketProtocolError } from './errors.js';

export type RoomUser = { readonly id: number; readonly roomUnitId: number; readonly name: string; readonly type: number; readonly x: number; readonly y: number };

export function parseRoomUsers(body: Uint8Array): readonly RoomUser[] {
  const reader = new PacketReader(body); const count = reader.readInt();
  if (count < 0) throw new PacketProtocolError(`RoomUsers count cannot be negative: ${count}`);
  const users: RoomUser[] = [];
  for (let i = 0; i < count; i += 1) {
    const id = reader.readInt(); const name = reader.readString(); reader.readString();
    reader.readInt(); reader.readInt(); reader.readInt(); reader.readInt(); reader.readString();
    const roomUnitId = reader.readInt(); const x = reader.readInt(); const y = reader.readInt();
    reader.readString(); reader.readInt(); const type = reader.readInt();
    if (type === 1) {
      reader.readString(); reader.readInt(); reader.readInt(); reader.readString(); reader.readString(); reader.readInt(); reader.readBoolean();
      reader.readString(); reader.readString(); reader.readString(); reader.readString(); reader.readString(); reader.readString(); reader.readString();
    } else if (type === 2) {
      reader.readInt(); reader.readInt(); reader.readString(); reader.readInt();
      reader.readBoolean(); reader.readBoolean(); reader.readBoolean(); reader.readBoolean(); reader.readBoolean(); reader.readBoolean(); reader.readInt(); reader.readString();
    } else if (type === 4) {
      reader.readString(); reader.readInt(); reader.readString(); const skills = reader.readInt();
      for (let j = 0; j < skills; j += 1) reader.readShort();
    }
    reader.readString(); reader.readInt(); reader.readInt(); users.push({ id, roomUnitId, name, type, x, y });
  }
  if (reader.remaining !== 0) throw new PacketProtocolError(`RoomUsers has ${reader.remaining} trailing bytes`);
  return users;
}
