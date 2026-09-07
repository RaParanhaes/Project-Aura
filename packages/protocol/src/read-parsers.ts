import { PacketBodyError, parsePacketBody } from './packet-body.js';
import type { PacketFrame } from './packet-frame.js';
import { PacketReader } from './packet-reader.js';
import { FROZEN_PACKET_REGISTRY } from './frozen-packet-registry.js';

const s2c = (name: string) => FROZEN_PACKET_REGISTRY.requireByName('server_to_client', name);
const bounded = (frame: PacketFrame, name: string): PacketReader => {
  if (frame.body.byteLength > 262144) throw new PacketBodyError(name, 'response exceeds 256 KiB');
  return new PacketReader(frame.body);
};

export type UserProfileRead = { readonly userId: number; readonly username: string; readonly look: string; readonly motto: string; readonly accountCreated: string; readonly achievementScore: number; readonly friendCount: number; readonly online: boolean; readonly totalBadges: number };
export function parseUserProfileRead(frame: PacketFrame): UserProfileRead {
  if (frame.header !== s2c('USER_PROFILE').header) throw new PacketBodyError('USER_PROFILE', 'unexpected header');
  const reader = bounded(frame, 'USER_PROFILE');
  const userId = reader.readInt(); const username = reader.readString(); const look = reader.readString(); const motto = reader.readString(); const accountCreated = reader.readString();
  const achievementScore = reader.readInt(); const friendCount = reader.readInt(); reader.readBoolean(); reader.readBoolean(); const online = reader.readBoolean();
  const guildCount = reader.readInt(); if (guildCount < 0 || guildCount > 100) throw new PacketBodyError('USER_PROFILE', 'invalid guild count');
  for (let i = 0; i < guildCount; i++) { reader.readInt(); reader.readString(); reader.readString(); reader.readString(); reader.readString(); reader.readBoolean(); reader.readInt(); reader.readBoolean(); }
  reader.readInt(); reader.readBoolean(); reader.readInt(); reader.readInt(); reader.readInt(); reader.readInt();
  for (let i = 0; i < 7; i++) reader.readString();
  const totalBadges = reader.readInt();
  return { userId, username, look, motto, accountCreated, achievementScore, friendCount, online, totalBadges };
}

export type InventoryBadgesRead = { readonly badges: readonly { readonly id: number; readonly code: string }[]; readonly equipped: readonly { readonly slot: number; readonly code: string }[] };
export function parseInventoryBadgesRead(frame: PacketFrame): InventoryBadgesRead {
  return parsePacketBody(frame, s2c('INVENTORY_BADGES'), reader => {
    const count = reader.readInt(); if (count < 0 || count > 10000) throw new PacketBodyError('INVENTORY_BADGES', 'invalid badge count');
    const badges = Array.from({ length: count }, () => ({ id: reader.readInt(), code: reader.readString() }));
    const equippedCount = reader.readInt(); if (equippedCount < 0 || equippedCount > count) throw new PacketBodyError('INVENTORY_BADGES', 'invalid equipped count');
    const equipped = Array.from({ length: equippedCount }, () => ({ slot: reader.readInt(), code: reader.readString() }));
    return { badges, equipped };
  });
}

export type InventoryItemsRead = { readonly totalFragments: number; readonly fragment: number; readonly itemCount: number; readonly rawItems: Uint8Array };
export function parseInventoryItemsRead(frame: PacketFrame): InventoryItemsRead {
  const reader = bounded(frame, 'INVENTORY_ITEMS');
  if (frame.header !== s2c('INVENTORY_ITEMS').header) throw new PacketBodyError('INVENTORY_ITEMS', 'unexpected header');
  const totalFragments = reader.readInt(); const fragment = reader.readInt(); const itemCount = reader.readInt();
  const emptyInventoryFragment = totalFragments === 1 && fragment === -1 && itemCount === 0;
  if (totalFragments < 1 || (!emptyInventoryFragment && (fragment < 0 || fragment >= totalFragments)) || itemCount < 0 || itemCount > 1000) throw new PacketBodyError('INVENTORY_ITEMS', 'invalid fragment metadata');
  return { totalFragments, fragment, itemCount, rawItems: reader.readBytes(reader.remaining) };
}

export type CatalogPageRead = { readonly pageId: number; readonly mode: string; readonly rawPage: Uint8Array };
export function parseCatalogPageRead(frame: PacketFrame): CatalogPageRead {
  const reader = bounded(frame, 'CATALOG_PAGE');
  if (frame.header !== s2c('CATALOG_PAGE').header) throw new PacketBodyError('CATALOG_PAGE', 'unexpected header');
  const pageId = reader.readInt(); const mode = reader.readString();
  if (pageId <= 0 || mode.length > 32) throw new PacketBodyError('CATALOG_PAGE', 'invalid page metadata');
  return { pageId, mode, rawPage: reader.readBytes(reader.remaining) };
}
