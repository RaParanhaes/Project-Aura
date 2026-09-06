import type { DomainEvent, RoomSnapshot } from '@aura/domain';

export type RoomHydrationState = 'idle' | 'loading' | 'ready' | 'failed';

/** Enforces a room snapshot barrier before releasing dependent events. */
export class RoomHydrator {
  private _state: RoomHydrationState = 'idle';
  private room: RoomSnapshot | undefined;
  private readonly pending: DomainEvent[] = [];

  get state(): RoomHydrationState { return this._state; }
  get snapshot(): RoomSnapshot | undefined { return this.room; }

  begin(roomId: number): void {
    this.room = undefined;
    this.pending.length = 0;
    this._state = roomId >= 0 ? 'loading' : 'failed';
  }

  acceptSnapshot(snapshot: RoomSnapshot): DomainEvent[] {
    if (this._state !== 'loading') throw new Error(`Cannot hydrate room while state is ${this._state}`);
    if (snapshot.roomId < 0 || !Number.isSafeInteger(snapshot.revision)) {
      this._state = 'failed';
      throw new Error('Invalid room snapshot');
    }
    this.room = { ...snapshot };
    this._state = 'ready';
    return this.pending.splice(0);
  }

  buffer(event: DomainEvent): void {
    if (this._state === 'ready') throw new Error('Room is already ready; dispatch event directly');
    this.pending.push(event);
  }

  fail(): void { this._state = 'failed'; }
}
