import { describe, expect, it } from 'vitest';
import { CHECKPOINT_SCHEMA_VERSION, InMemoryCheckpointStore, parseAgentCheckpoint } from '../../packages/persistence/src/index.ts';

const checkpoint = {
  schemaVersion: CHECKPOINT_SCHEMA_VERSION,
  agentId: 'aura-test-1', sequence: 1, reason: 'room entered', createdAt: 100,
  state: { schemaVersion: 1, agentId: 'aura-test-1', identity: { name: 'AURA' }, objective: 'remain available', homeRoomId: 42, lastKnownRoomId: 42, updatedAt: 99 }
} as const;

describe('agent checkpoints', () => {
  it('restores the latest continuity checkpoint in sequence order', async () => {
    const store = new InMemoryCheckpointStore();
    await store.save(checkpoint);
    await store.save({ ...checkpoint, sequence: 2, reason: 'objective updated', createdAt: 110 });
    await expect(store.latest(checkpoint.agentId)).resolves.toMatchObject({ sequence: 2, state: checkpoint.state });
    await expect(store.list(checkpoint.agentId)).resolves.toHaveLength(2);
  });

  it('rejects invalid state, identity mismatches and non-increasing sequences', async () => {
    expect(() => parseAgentCheckpoint({ ...checkpoint, state: { ...checkpoint.state, socket: {} } })).toThrow(/shape/i);
    expect(() => parseAgentCheckpoint({ ...checkpoint, agentId: 'other' })).toThrow(/identity/i);
    const store = new InMemoryCheckpointStore();
    await store.save(checkpoint);
    await expect(store.save(checkpoint)).rejects.toThrow(/sequence/i);
  });

  it('keeps transient runtime data outside the checkpoint', async () => {
    const store = new InMemoryCheckpointStore();
    await store.save(checkpoint);
    const restored = await store.latest(checkpoint.agentId);
    expect(restored).not.toHaveProperty('socket');
    expect(restored?.state).not.toHaveProperty('users');
  });
});
