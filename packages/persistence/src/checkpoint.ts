import { parseAgentState } from './state.js';
import type { AgentState } from './state.js';

export const CHECKPOINT_SCHEMA_VERSION = 1 as const;

export type AgentCheckpoint = {
  readonly schemaVersion: typeof CHECKPOINT_SCHEMA_VERSION;
  readonly agentId: string;
  readonly sequence: number;
  readonly reason: string;
  readonly createdAt: number;
  readonly state: AgentState;
};

export interface CheckpointStore {
  save(checkpoint: AgentCheckpoint): Promise<void>;
  latest(agentId: string): Promise<AgentCheckpoint | undefined>;
  list(agentId: string): Promise<readonly AgentCheckpoint[]>;
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function validTime(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) && value >= 0; }

export function parseAgentCheckpoint(value: unknown): AgentCheckpoint {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Invalid checkpoint shape');
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  const expected = ['schemaVersion', 'agentId', 'sequence', 'reason', 'createdAt', 'state'];
  if (keys.length !== expected.length || keys.some((key) => !expected.includes(key))) throw new Error('Invalid checkpoint shape');
  if (record.schemaVersion !== CHECKPOINT_SCHEMA_VERSION || typeof record.agentId !== 'string' || record.agentId.length === 0) {
    throw new Error('Unsupported checkpoint version or identity');
  }
  if (!Number.isSafeInteger(record.sequence) || (record.sequence as number) < 0 || typeof record.reason !== 'string' || record.reason.length === 0 || !validTime(record.createdAt)) {
    throw new Error('Invalid checkpoint metadata');
  }
  const state = parseAgentState(record.state);
  if (state.agentId !== record.agentId) throw new Error('Checkpoint identity mismatch');
  return clone({ ...record, state }) as AgentCheckpoint;
}

export class InMemoryCheckpointStore implements CheckpointStore {
  private readonly checkpoints = new Map<string, AgentCheckpoint[]>();

  async save(checkpoint: AgentCheckpoint): Promise<void> {
    const validated = parseAgentCheckpoint(checkpoint);
    const entries = this.checkpoints.get(validated.agentId) ?? [];
    const previous = entries.at(-1);
    if (previous && validated.sequence <= previous.sequence) throw new Error('Checkpoint sequence must increase');
    entries.push(validated);
    this.checkpoints.set(validated.agentId, entries);
  }

  async latest(agentId: string): Promise<AgentCheckpoint | undefined> {
    const entry = this.checkpoints.get(agentId)?.at(-1);
    return entry === undefined ? undefined : clone(entry);
  }

  async list(agentId: string): Promise<readonly AgentCheckpoint[]> {
    return (this.checkpoints.get(agentId) ?? []).map(clone);
  }
}
