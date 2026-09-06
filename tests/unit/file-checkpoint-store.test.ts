import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { FileCheckpointStore } from '../../packages/persistence/src/index.ts';

const checkpoint = (sequence: number) => ({
  schemaVersion: 1 as const,
  agentId: 'aura-file-test', sequence, reason: 'session authenticated', createdAt: sequence,
  state: { schemaVersion: 1 as const, agentId: 'aura-file-test', identity: { name: 'AURA' }, objective: null, homeRoomId: null, lastKnownRoomId: null, updatedAt: sequence }
});

const paths: string[] = [];
afterEach(async () => { await Promise.all(paths.splice(0).map(path => rm(path, { recursive: true, force: true }))); });

describe('file-backed checkpoints', () => {
  it('survives a new store instance and advances sequence', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'aura-checkpoint-'));
    paths.push(directory);
    const path = join(directory, 'state.json');
    await new FileCheckpointStore(path).save(checkpoint(1));
    const second = new FileCheckpointStore(path);
    await expect(second.latest('aura-file-test')).resolves.toMatchObject({ sequence: 1 });
    await second.save(checkpoint(2));
    await expect(new FileCheckpointStore(path).latest('aura-file-test')).resolves.toMatchObject({ sequence: 2 });
    await expect(readFile(path, 'utf8')).resolves.toContain('aura-file-test');
  });

  it('rejects non-increasing records and malformed files', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'aura-checkpoint-'));
    paths.push(directory);
    const path = join(directory, 'state.json');
    const store = new FileCheckpointStore(path);
    await store.save(checkpoint(1));
    await expect(store.save(checkpoint(1))).rejects.toThrow(/sequence/i);
    await (await import('node:fs/promises')).writeFile(path, '{"bad":true}');
    await expect(store.latest('aura-file-test')).rejects.toThrow(/checkpoint/i);
  });
});
