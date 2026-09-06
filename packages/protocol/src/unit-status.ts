import { PacketBodyError, parsePacketBody } from './packet-body.js';
import type { PacketFrame } from './packet-frame.js';
import { FROZEN_PACKET_REGISTRY } from './frozen-packet-registry.js';

const UNIT_STATUS = FROZEN_PACKET_REGISTRY.requireByName('server_to_client', 'UNIT_STATUS');

export type UnitStatus = {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly headDirection: number;
  readonly direction: number;
  readonly actions: readonly string[];
  readonly target?: { readonly x: number; readonly y: number; readonly z: number };
  readonly posture?: 'sit' | 'lay';
};

const parseZ = (value: string): number => {
  const parsed = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsed)) throw new PacketBodyError('UNIT_STATUS', 'invalid z coordinate');
  return parsed;
};

export function parseUnitStatus(frame: PacketFrame): readonly UnitStatus[] {
  return parsePacketBody(frame, UNIT_STATUS, reader => {
    const count = reader.readInt();
    if (count < 0) throw new PacketBodyError('UNIT_STATUS', 'negative unit count');
    const statuses: UnitStatus[] = [];
    for (let index = 0; index < count; index += 1) {
      const id = reader.readInt();
      const x = reader.readInt();
      const y = reader.readInt();
      const z = parseZ(reader.readString());
      const headDirection = reader.readInt();
      const direction = reader.readInt();
      const actionText = reader.readString();
      const actions = actionText ? actionText.split('/').filter(Boolean) : [];
      let target: UnitStatus['target'];
      let posture: UnitStatus['posture'];
      for (const action of actions) {
        const [kind, value] = action.split(' ');
        if (kind === 'mv' && value) {
          const [targetX, targetY, targetZ] = value.split(',');
          if (targetX === undefined || targetY === undefined || targetZ === undefined) throw new PacketBodyError('UNIT_STATUS', 'invalid move action');
          target = { x: Number(targetX), y: Number(targetY), z: parseZ(targetZ) };
        }
        if (kind === 'sit') posture = 'sit';
        if (kind === 'lay') posture = 'lay';
      }
      statuses.push({ id, x, y, z, headDirection, direction, actions, ...(target ? { target } : {}), ...(posture ? { posture } : {}) });
    }
    return statuses;
  });
}
