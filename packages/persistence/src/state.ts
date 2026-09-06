/** Current durable agent-state schema. Bump only with an explicit migration. */
export const AGENT_STATE_SCHEMA_VERSION = 1 as const;

export type AgentState = {
  readonly schemaVersion: typeof AGENT_STATE_SCHEMA_VERSION;
  readonly agentId: string;
  readonly identity: { readonly name: string };
  readonly objective: string | null;
  readonly homeRoomId: number | null;
  readonly lastKnownRoomId: number | null;
  readonly updatedAt: number;
};

export interface AgentStateRepository {
  load(agentId: string): Promise<AgentState | undefined>;
  save(state: AgentState): Promise<void>;
  remove(agentId: string): Promise<void>;
}

function cloneState(state: AgentState): AgentState {
  return JSON.parse(JSON.stringify(state)) as AgentState;
}

const STATE_KEYS = new Set(['schemaVersion', 'agentId', 'identity', 'objective', 'homeRoomId', 'lastKnownRoomId', 'updatedAt']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validRoomId(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0);
}

/** Validate untrusted persisted data before it crosses into runtime state. */
export function parseAgentState(value: unknown): AgentState {
  if (!isRecord(value) || Object.keys(value).some((key) => !STATE_KEYS.has(key))) {
    throw new Error('Invalid agent state shape');
  }
  if (value.schemaVersion !== AGENT_STATE_SCHEMA_VERSION || typeof value.agentId !== 'string' || value.agentId.length === 0) {
    throw new Error('Unsupported agent state version or identity');
  }
  if (!isRecord(value.identity) || typeof value.identity.name !== 'string' || value.identity.name.length === 0) {
    throw new Error('Invalid agent identity');
  }
  if (value.objective !== null && typeof value.objective !== 'string') throw new Error('Invalid agent objective');
  if (!validRoomId(value.homeRoomId) || !validRoomId(value.lastKnownRoomId)) throw new Error('Invalid room reference');
  if (typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt) || value.updatedAt < 0) {
    throw new Error('Invalid agent state timestamp');
  }
  return cloneState(value as AgentState);
}

export class InMemoryAgentStateRepository implements AgentStateRepository {
  private readonly states = new Map<string, AgentState>();

  async load(agentId: string): Promise<AgentState | undefined> {
    const state = this.states.get(agentId);
    return state === undefined ? undefined : cloneState(state);
  }

  async save(state: AgentState): Promise<void> {
    const validated = parseAgentState(state);
    this.states.set(validated.agentId, validated);
  }

  async remove(agentId: string): Promise<void> {
    this.states.delete(agentId);
  }
}
