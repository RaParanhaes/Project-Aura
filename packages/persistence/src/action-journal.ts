export const ACTION_OUTCOMES = ['pending', 'confirmed', 'rejected', 'ambiguous'] as const;
export type ActionOutcome = (typeof ACTION_OUTCOMES)[number];

export type ActionJournalEntry = {
  readonly actionId: string;
  readonly intent: string;
  readonly startedAt: number;
  readonly outcome: ActionOutcome;
  readonly finishedAt?: number;
  readonly reason?: string;
};

export interface ActionJournal {
  start(actionId: string, intent: string, startedAt: number): Promise<ActionJournalEntry>;
  transition(actionId: string, outcome: Exclude<ActionOutcome, 'pending'>, at: number, reason?: string): Promise<ActionJournalEntry>;
  get(actionId: string): Promise<ActionJournalEntry | undefined>;
  list(): Promise<readonly ActionJournalEntry[]>;
}

function clone(entry: ActionJournalEntry): ActionJournalEntry {
  return JSON.parse(JSON.stringify(entry)) as ActionJournalEntry;
}

function validTime(value: number): boolean { return Number.isFinite(value) && value >= 0; }

export class InMemoryActionJournal implements ActionJournal {
  private readonly entries = new Map<string, ActionJournalEntry>();

  async start(actionId: string, intent: string, startedAt: number): Promise<ActionJournalEntry> {
    if (actionId.length === 0 || intent.length === 0 || !validTime(startedAt)) throw new Error('Invalid action journal entry');
    if (this.entries.has(actionId)) throw new Error(`Action already exists: ${actionId}`);
    const entry: ActionJournalEntry = { actionId, intent, startedAt, outcome: 'pending' };
    this.entries.set(actionId, entry);
    return clone(entry);
  }

  async transition(actionId: string, outcome: Exclude<ActionOutcome, 'pending'>, at: number, reason?: string): Promise<ActionJournalEntry> {
    const current = this.entries.get(actionId);
    if (!current) throw new Error(`Unknown action: ${actionId}`);
    if (!validTime(at) || at < current.startedAt) throw new Error('Invalid action outcome time');
    if (current.outcome !== 'pending' && current.outcome !== 'ambiguous') throw new Error(`Action already finalized: ${actionId}`);
    if (current.outcome === 'ambiguous' && outcome === 'ambiguous') throw new Error(`Action already ambiguous: ${actionId}`);
    const next: ActionJournalEntry = reason === undefined
      ? { ...current, outcome, finishedAt: at }
      : { ...current, outcome, finishedAt: at, reason };
    this.entries.set(actionId, next);
    return clone(next);
  }

  async get(actionId: string): Promise<ActionJournalEntry | undefined> {
    const entry = this.entries.get(actionId);
    return entry === undefined ? undefined : clone(entry);
  }

  async list(): Promise<readonly ActionJournalEntry[]> {
    return [...this.entries.values()].map(clone);
  }
}
