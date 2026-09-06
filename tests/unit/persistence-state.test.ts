import { describe, expect, it } from 'vitest';
import {
  AGENT_STATE_SCHEMA_VERSION,
  InMemoryAgentStateRepository,
  parseAgentState
} from '../../packages/persistence/src/index.ts';

const state = {
  schemaVersion: AGENT_STATE_SCHEMA_VERSION,
  agentId: 'aura-test-1',
  identity: { name: 'AURA' },
  objective: 'remain available',
  homeRoomId: 42,
  lastKnownRoomId: 42,
  updatedAt: 1000
} as const;

describe('durable agent state boundary', () => {
  it('validates and round-trips only versioned durable fields', async () => {
    const repository = new InMemoryAgentStateRepository();
    await repository.save(state);
    const restored = await repository.load(state.agentId);
    expect(restored).toEqual(state);
    expect(restored).not.toBe(state);
  });

  it('rejects unsupported versions and live runtime fields', () => {
    expect(() => parseAgentState({ ...state, schemaVersion: 2 })).toThrow(/version/i);
    expect(() => parseAgentState({ ...state, socket: {} })).toThrow(/shape/i);
  });

  it('does not persist transient world details', async () => {
    const repository = new InMemoryAgentStateRepository();
    await repository.save(state);
    const restored = await repository.load(state.agentId);
    expect(restored).not.toHaveProperty('users');
    expect(restored).not.toHaveProperty('socket');
    expect(restored).not.toHaveProperty('timer');
  });
});
