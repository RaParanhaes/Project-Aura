export type PerceptionEvent =
  | { readonly kind: 'roster_observed'; readonly sourceRevision: number; readonly observedAt: number; readonly userIds: readonly number[] }
  | { readonly kind: 'movement_observed'; readonly sourceRevision: number; readonly observedAt: number; readonly userId: number; readonly x: number; readonly y: number }
  | { readonly kind: 'typing_observed'; readonly sourceRevision: number; readonly observedAt: number; readonly userId: number; readonly typing: boolean }
  | { readonly kind: 'chat_observed'; readonly sourceRevision: number; readonly observedAt: number; readonly userId: number; readonly text: string };

export type PerceptionEventWindowSnapshot = { readonly events: readonly PerceptionEvent[]; readonly droppedCount: number };
export type PerceptionEventWindowOptions = { readonly maxEvents?: number; readonly ttlMs?: number };

const valid = (value: number): boolean => Number.isSafeInteger(value) && value >= 0;

/** Retains recent perception evidence while coalescing replaceable movement updates. */
export class PerceptionEventWindow {
  private readonly maxEvents: number;
  private readonly ttlMs: number;
  private events: PerceptionEvent[] = [];
  private droppedCount = 0;

  constructor(options: PerceptionEventWindowOptions = {}) {
    this.maxEvents = options.maxEvents ?? 64;
    this.ttlMs = options.ttlMs ?? 30_000;
    if (!Number.isSafeInteger(this.maxEvents) || this.maxEvents < 1) throw new Error('Perception maxEvents must be a positive safe integer');
    if (!Number.isSafeInteger(this.ttlMs) || this.ttlMs < 1) throw new Error('Perception ttlMs must be a positive safe integer');
  }

  append(event: PerceptionEvent): void {
    if (!valid(event.observedAt) || !valid(event.sourceRevision)) throw new Error('Perception events require non-negative safe timestamps and revisions');
    if (event.kind === 'chat_observed' && typeof event.text !== 'string') throw new Error('Perception chat text must remain a string');
    if (event.kind === 'movement_observed') this.events = this.events.filter(candidate => !(candidate.kind === 'movement_observed' && candidate.userId === event.userId));
    this.events.push(event);
    while (this.events.length > this.maxEvents) { this.events.shift(); this.droppedCount += 1; }
  }

  snapshot(now: number): PerceptionEventWindowSnapshot {
    if (!valid(now)) throw new Error('Perception snapshot time must be a non-negative safe integer');
    this.events = this.events.filter(event => event.observedAt >= now - this.ttlMs);
    return { events: this.events.slice(), droppedCount: this.droppedCount };
  }
}
