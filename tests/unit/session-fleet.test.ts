import { describe, expect, it } from 'vitest';
import { RealSession, SessionFleet, type AuthProvider, type SessionTransport } from '../../packages/runtime/src/index.ts';

const transport: SessionTransport = { connect: async () => {}, send: async () => {}, close: async () => {}, onMessage: () => () => {}, onClose: () => () => {}, onError: () => () => {} };

function session(agentId: string, failing = false): RealSession {
  const auth: AuthProvider = { authenticate: async () => { if (failing) throw new Error('authentication failed'); } };
  return new RealSession(agentId, transport, auth);
}

describe('SessionFleet', () => {
  it('starts four sessions concurrently and isolates one authentication failure', async () => {
    const fleet = new SessionFleet();
    const result = await fleet.start(['agent-1', 'agent-2', 'agent-3', 'agent-4'], id => session(id, id === 'agent-3'));
    expect(result.filter(entry => entry.session)).toHaveLength(3);
    expect(result.find(entry => entry.agentId === 'agent-3')?.error).toBeInstanceOf(Error);
    expect(fleet.size).toBe(3);
    expect(fleet.get('agent-1')?.state).toBe('online');
    await fleet.stop();
    expect(fleet.size).toBe(0);
  });

  it('rejects duplicate identities and capacity overflow', async () => {
    const fleet = new SessionFleet(undefined, 2);
    await expect(fleet.start(['agent-1', 'agent-1'], id => session(id))).rejects.toThrow(/unique/i);
    await expect(fleet.start(['agent-1', 'agent-2', 'agent-3'], id => session(id))).rejects.toThrow(/limit/i);
  });
});
