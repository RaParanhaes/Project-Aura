import { describe, expect, it } from 'vitest';
import { RealSession, SessionError, SessionManager, type AuthProvider, type SessionTransport } from '../../packages/runtime/src/index.ts';

const transport: SessionTransport = { connect: async () => {}, send: async () => {}, close: async () => {}, onMessage: () => () => {}, onClose: () => () => {}, onError: () => () => {} };
const auth: AuthProvider = { authenticate: async () => {} };

describe('SessionManager', () => {
  it('rejects duplicate sessions for the same agent and allows cleanup', () => {
    const manager = new SessionManager();
    const first = new RealSession('agent-1', transport, auth);
    const second = new RealSession('agent-1', transport, auth);
    manager.register(first);
    expect(() => manager.register(second)).toThrow(SessionError);
    manager.unregister(first);
    expect(() => manager.register(second)).not.toThrow();
  });
});
