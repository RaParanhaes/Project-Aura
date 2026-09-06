import { describe, expect, it } from 'vitest';
import { ActionReconciler, InMemoryActionJournal } from '../../packages/persistence/src/index.ts';

describe('action reconciliation', () => {
  it('observes an ambiguous action before resolving it', async () => {
    const journal = new InMemoryActionJournal();
    await journal.start('a-1', 'ENTER_ROOM', 10);
    await journal.transition('a-1', 'ambiguous', 11, 'connection lost');
    const reconciler = new ActionReconciler(journal);
    const observe = async (action: { actionId: string }) => { expect(action.actionId).toBe('a-1'); return 'confirmed' as const; };
    await expect(reconciler.reconcile('a-1', observe, 20)).resolves.toMatchObject({ resolved: true, retryAllowed: false, action: { outcome: 'confirmed' } });
  });

  it('keeps unknown effects ambiguous and never permits automatic retry', async () => {
    const journal = new InMemoryActionJournal();
    await journal.start('a-2', 'SAY', 10);
    await journal.transition('a-2', 'ambiguous', 11);
    const result = await new ActionReconciler(journal).reconcile('a-2', async () => 'unknown', 20);
    expect(result).toMatchObject({ resolved: false, retryAllowed: false, action: { outcome: 'ambiguous' } });
  });

  it('rejects reconciliation of actions without an ambiguous outcome', async () => {
    const journal = new InMemoryActionJournal();
    await journal.start('a-3', 'WALK_TO', 10);
    await expect(new ActionReconciler(journal).reconcile('a-3', async () => 'confirmed', 20)).rejects.toThrow(/ambiguous/i);
  });
});
