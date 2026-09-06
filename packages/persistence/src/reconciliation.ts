import type { ActionJournal, ActionJournalEntry } from './action-journal.js';

export type ReconciliationObservation = 'confirmed' | 'rejected' | 'unknown';
export type ObserveAction = (action: ActionJournalEntry) => Promise<ReconciliationObservation>;

export type ReconciliationResult = {
  readonly action: ActionJournalEntry;
  readonly resolved: boolean;
  readonly retryAllowed: false;
};

/** Resolves ambiguous external effects from observation; it never blindly retries them. */
export class ActionReconciler {
  public constructor(private readonly journal: ActionJournal) {}

  async reconcile(actionId: string, observe: ObserveAction, at: number): Promise<ReconciliationResult> {
    const action = await this.journal.get(actionId);
    if (!action) throw new Error(`Unknown action: ${actionId}`);
    if (action.outcome !== 'ambiguous') throw new Error(`Action is not ambiguous: ${actionId}`);
    const observation = await observe(action);
    if (observation === 'unknown') return { action, resolved: false, retryAllowed: false };
    const resolved = await this.journal.transition(actionId, observation, at, 'resolved from Polaris observation');
    return { action: resolved, resolved: true, retryAllowed: false };
  }
}
