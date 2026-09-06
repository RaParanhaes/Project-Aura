import type { DomainEvent, WorldStateSnapshot } from '@aura/domain';

/** Projection of confirmed observations; it has no action-success mutation API. */
export class WorldState {
  private revisionValue = 0;
  private roomIdValue: number | undefined;
  private homeRoomValue: number | undefined;
  private observedAtValue: number | undefined;
  private usersValue: WorldStateSnapshot['users'] = [];

  get snapshot(): WorldStateSnapshot {
    return {
      revision: this.revisionValue,
      roomId: this.roomIdValue,
      homeRoom: this.homeRoomValue,
      lastObservedAt: this.observedAtValue,
      users: this.usersValue,
    };
  }

  apply(event: DomainEvent): WorldStateSnapshot {
    if (this.observedAtValue !== undefined && event.observedAt < this.observedAtValue) {
      return this.snapshot;
    }
    this.revisionValue += 1;
    this.observedAtValue = event.observedAt;
    switch (event.kind) {
      case 'session_authenticated': this.roomIdValue = (event.payload as { readonly roomId: number }).roomId; break;
      case 'user_home_room_observed': this.homeRoomValue = (event.payload as { readonly homeRoom: number }).homeRoom; break;
      case 'room_opened': break;
      case 'server_ping': break;
      case 'room_users_observed': this.usersValue = (event.payload as { readonly users: WorldStateSnapshot['users'] }).users; break;
    }
    return this.snapshot;
  }
}
