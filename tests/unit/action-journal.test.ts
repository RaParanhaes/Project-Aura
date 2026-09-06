import { describe, expect, it } from 'vitest';
import { InMemoryActionJournal } from '../../packages/persistence/src/index.ts';

describe('ActionJournal', () => {
  it('records pending actions and reconciles them to a final outcome', async () => {
    const journal = new InMemoryActionJournal();
    await expect(journal.start('a-1', 'SAY', 10)).resolves.toMatchObject({ actionId: 'a-1', outcome: 'pending' });
    await expect(journal.transition('a-1', 'confirmed', 12)).resolves.toMatchObject({ outcome: 'confirmed', finishedAt: 12 });
  });

  it('allows ambiguous actions to be resolved once, without replaying them', async () => {
    const journal = new InMemoryActionJournal();
    await journal.start('a-2', 'ENTER_ROOM', 20);
    await expect(journal.transition('a-2', 'ambiguous', 21, 'connection lost')).resolves.toMatchObject({ outcome: 'ambiguous', reason: 'connection lost' });
    await expect(journal.transition('a-2', 'confirmed', 30)).resolves.toMatchObject({ outcome: 'confirmed' });
    await expect(journal.transition('a-2', 'rejected', 31)).rejects.toThrow(/finalized/i);
  });

  it('rejects duplicate actions and invalid timestamps', async () => {
    const journal = new InMemoryActionJournal();
    await journal.start('a-3', 'WALK_TO', 50);
    await expect(journal.start('a-3', 'WALK_TO', 51)).rejects.toThrow(/already exists/i);
    await expect(journal.transition('a-3', 'rejected', 49)).rejects.toThrow(/time/i);
  });
});
