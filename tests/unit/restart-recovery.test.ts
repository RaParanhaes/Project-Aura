import { describe, expect, it } from 'vitest';
import { InMemoryActionJournal, InMemoryCheckpointStore, RestartRecovery } from '../../packages/persistence/src/index.ts';

const checkpoint = {
  schemaVersion: 1 as const, agentId: 'agent-1', sequence: 1, reason: 'startup', createdAt: 10,
  state: { schemaVersion: 1 as const, agentId: 'agent-1', identity: { name: 'AURA' }, objective: 'remain available', homeRoomId: 42, lastKnownRoomId: 42, updatedAt: 9 }
};

describe('restart recovery', () => {
  it('restores continuity, marks unconfirmed actions ambiguous and rebuilds world state', async () => {
    const checkpoints = new InMemoryCheckpointStore();
    const journal = new InMemoryActionJournal();
    await checkpoints.save(checkpoint);
    await journal.start('agent-1:walk-1', 'WALK_TO', 11);
    await journal.start('other:say-1', 'SAY', 11);
    const plan = await new RestartRecovery(checkpoints, journal).recover('agent-1', 20);
    expect(plan.checkpoint).toEqual(checkpoint);
    expect(plan.rebuildWorldState).toBe(true);
    expect(plan.requiresReconciliation).toEqual(['agent-1:walk-1']);
    await expect(journal.get('agent-1:walk-1')).resolves.toMatchObject({ outcome: 'ambiguous' });
    await expect(journal.get('other:say-1')).resolves.toMatchObject({ outcome: 'pending' });
  });

  it('fails closed when continuity has no checkpoint', async () => {
    await expect(new RestartRecovery(new InMemoryCheckpointStore(), new InMemoryActionJournal()).recover('missing', 1)).rejects.toThrow(/checkpoint/i);
  });
});
