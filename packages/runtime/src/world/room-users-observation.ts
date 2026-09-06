import type { ObservedRoomUser } from '@aura/domain';
import type { EventNormalizer } from './event-normalizer.js';

export type RoomUsersDecoder = (body: Uint8Array) => readonly ObservedRoomUser[];

/** Connects the protocol RoomUsers decoder to the observed world event stream. */
export function registerRoomUsersObservation(normalizer: EventNormalizer, decode: RoomUsersDecoder): void {
  normalizer.register(374, 'room_users_observed', (packet) => ({ users: decode(packet.body) }));
}
