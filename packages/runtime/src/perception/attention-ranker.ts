import type { ObservedRoomUser } from '@aura/domain';
import type { PerceptionSnapshot, PerceivedRoomUser } from './perception-filter.js';

export type AttentionSignal = {
  readonly userId: number;
  readonly directInteraction?: boolean;
  readonly mentioned?: boolean;
  readonly recentlyInteracted?: boolean;
};

export type AttentionReason = 'direct_interaction' | 'mention' | 'recent_interaction' | 'proximity';

export type AttentionFocus = {
  readonly user: ObservedRoomUser;
  readonly score: number;
  readonly reasons: readonly AttentionReason[];
};

export type AttentionSnapshot = {
  readonly status: 'ready' | 'no_perception' | 'stale';
  readonly sourceRevision: number;
  readonly focuses: readonly AttentionFocus[];
};

export type AttentionRankerOptions = {
  readonly maxFocuses?: number;
  readonly expectedSourceRevision?: number;
};

const proximityScore = (distance: number): number => Math.max(0, 20 - distance);

/** Selects an explainable bounded focus set from one resident's perception. */
export class AttentionRanker {
  private readonly maxFocuses: number;

  constructor(options: AttentionRankerOptions = {}) {
    this.maxFocuses = options.maxFocuses ?? 3;
    if (!Number.isSafeInteger(this.maxFocuses) || this.maxFocuses < 1) throw new Error('Attention maxFocuses must be a positive safe integer');
  }

  rank(perception: PerceptionSnapshot, signals: readonly AttentionSignal[] = [], options: AttentionRankerOptions = {}): AttentionSnapshot {
    if (options.expectedSourceRevision !== undefined && options.expectedSourceRevision !== perception.sourceRevision) {
      return { status: 'stale', sourceRevision: perception.sourceRevision, focuses: [] };
    }
    if (perception.status !== 'ready') return { status: 'no_perception', sourceRevision: perception.sourceRevision, focuses: [] };

    const signalByUser = new Map(signals.map(signal => [signal.userId, signal]));
    const focuses = perception.nearbyUsers.map(candidate => this.score(candidate, signalByUser.get(candidate.user.id)))
      .sort((left, right) => right.score - left.score
        || left.user.roomUnitId - right.user.roomUnitId
        || left.user.id - right.user.id);
    return { status: 'ready', sourceRevision: perception.sourceRevision, focuses: focuses.slice(0, this.maxFocuses) };
  }

  private score(candidate: PerceivedRoomUser, signal: AttentionSignal | undefined): AttentionFocus {
    const reasons: AttentionReason[] = ['proximity'];
    let score = proximityScore(candidate.distance);
    if (signal?.directInteraction) { score += 100; reasons.unshift('direct_interaction'); }
    if (signal?.mentioned) { score += 50; reasons.unshift('mention'); }
    if (signal?.recentlyInteracted) { score += 25; reasons.unshift('recent_interaction'); }
    return { user: candidate.user, score, reasons };
  }
}
