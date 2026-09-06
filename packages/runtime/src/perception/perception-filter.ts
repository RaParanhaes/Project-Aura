import type { ObservedRoomUser, WorldStateSnapshot } from '@aura/domain';

export type PerceptionStatus = 'outside_room' | 'self_not_observed' | 'ready';

export type PerceivedRoomUser = {
  readonly user: ObservedRoomUser;
  readonly distance: number;
};

export type PerceptionSnapshot = {
  readonly status: PerceptionStatus;
  readonly sourceRevision: number;
  readonly roomId: number | undefined;
  readonly observedAt: number | undefined;
  readonly self: ObservedRoomUser | undefined;
  readonly nearbyUsers: readonly PerceivedRoomUser[];
  readonly truncated: boolean;
};

export type PerceptionFilterOptions = {
  readonly radius?: number;
  readonly maxUsers?: number;
};

const tileDistance = (left: ObservedRoomUser, right: ObservedRoomUser): number =>
  Math.max(Math.abs(left.x - right.x), Math.abs(left.y - right.y));

/** Builds one resident's bounded view from Polaris-confirmed WorldState. */
export class PerceptionFilter {
  private readonly radius: number;
  private readonly maxUsers: number;

  constructor(options: PerceptionFilterOptions = {}) {
    this.radius = options.radius ?? 6;
    this.maxUsers = options.maxUsers ?? 12;
    if (!Number.isSafeInteger(this.radius) || this.radius < 0) throw new Error('Perception radius must be a non-negative safe integer');
    if (!Number.isSafeInteger(this.maxUsers) || this.maxUsers < 1) throw new Error('Perception maxUsers must be a positive safe integer');
  }

  project(world: WorldStateSnapshot, selfUserId: number): PerceptionSnapshot {
    if (!Number.isSafeInteger(selfUserId) || selfUserId < 1) throw new Error('Perception selfUserId must be a positive safe integer');

    const base = {
      sourceRevision: world.revision,
      roomId: world.roomId,
      observedAt: world.lastObservedAt,
    };
    if (world.roomId === undefined || world.roomId < 1) {
      return { ...base, status: 'outside_room', self: undefined, nearbyUsers: [], truncated: false };
    }

    const self = world.users.find(user => user.id === selfUserId);
    if (!self) {
      return { ...base, status: 'self_not_observed', self: undefined, nearbyUsers: [], truncated: false };
    }

    const candidates = world.users
      .filter(user => user.id !== selfUserId)
      .map(user => ({ user, distance: tileDistance(self, user) }))
      .filter(candidate => candidate.distance <= this.radius)
      .sort((left, right) => left.distance - right.distance
        || left.user.roomUnitId - right.user.roomUnitId
        || left.user.id - right.user.id);

    return {
      ...base,
      status: 'ready',
      self,
      nearbyUsers: candidates.slice(0, this.maxUsers),
      truncated: candidates.length > this.maxUsers,
    };
  }
}
