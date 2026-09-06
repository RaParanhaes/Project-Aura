import type { ActionJournal, ActionJournalEntry } from './action-journal.js';
import type { AgentCheckpoint, CheckpointStore } from './checkpoint.js';

export type RecoveryPlan = {
  readonly checkpoint: AgentCheckpoint;
  readonly actions: readonly ActionJournalEntry[];
  readonly rebuildWorldState: true;
  readonly requiresReconciliation: readonly string[];
};

/** Rebuilds ephemeral runtime state from Polaris after an AURA or Polaris restart. */
export class RestartRecovery {
  public constructor(private readonly checkpoints: CheckpointStore, private readonly journal: ActionJournal) {}

  async recover(agentId: string, at: number): Promise<RecoveryPlan> {
    const checkpoint = await this.checkpoints.latest(agentId);
    if (!checkpoint) throw new Error(`No checkpoint available for agent: ${agentId}`);
    const existing = await this.journal.list();
    const agentActions = existing.filter((action) => action.actionId.startsWith(`${agentId}:`));
    for (const action of agentActions) {
      if (action.outcome === 'pending') await this.journal.transition(action.actionId, 'ambiguous', at, 'runtime restarted before confirmation');
    }
    const actions = (await this.journal.list()).filter((action) => action.actionId.startsWith(`${agentId}:`));
    return {
      checkpoint,
      actions,
      rebuildWorldState: true,
      requiresReconciliation: actions.filter((action) => action.outcome === 'ambiguous').map((action) => action.actionId)
    };
  }
}
