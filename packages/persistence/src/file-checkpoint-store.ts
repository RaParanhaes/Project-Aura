// @ts-nocheck
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parseAgentCheckpoint, type AgentCheckpoint, type CheckpointStore } from './checkpoint.js';

export class FileCheckpointStore implements CheckpointStore {
  constructor(private readonly path: string) {}

  async save(checkpoint) {
    const entries = await this.read();
    const previous = entries.at(-1);
    const validated = parseAgentCheckpoint(checkpoint);
    if (previous && validated.agentId === previous.agentId && validated.sequence <= previous.sequence) throw new Error('Checkpoint sequence must increase');
    entries.push(validated);
    await this.write(entries);
  }

  async latest(agentId) {
    const entries = await this.read();
    const entry = entries.filter((candidate) => candidate.agentId === agentId).at(-1);
    return entry === undefined ? undefined : JSON.parse(JSON.stringify(entry));
  }

  async list(agentId) { return (await this.read()).filter((entry) => entry.agentId === agentId); }

  async read() {
    try {
      const raw = await readFile(this.path, 'utf8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('Invalid checkpoint file');
      return parsed.map(parseAgentCheckpoint);
    } catch (error) {
      if (error?.code === 'ENOENT') return [];
      throw error;
    }
  }

  async write(entries) {
    await mkdir(dirname(this.path), { recursive: true });
    const temporary = `${this.path}.tmp`;
    await writeFile(temporary, JSON.stringify(entries) + '\n', { mode: 0o600 });
    await rename(temporary, this.path);
  }
}
