import { describe, expect, it } from 'vitest';
import { RealSession, SessionError, type SessionTransport, type AuthProvider } from '../../packages/runtime/src/index.ts';

class FakeTransport implements SessionTransport {
  connected = false;
  sent: Uint8Array[] = [];
  private message = (_payload: Uint8Array) => {};
  private closeEvent = (_reason: { code?: number; reason?: string }) => {};
  private errorEvent = (_error: unknown) => {};
  async connect() { this.connected = true; }
  async send(payload: Uint8Array) { this.sent.push(payload); }
  async close(reason = {}) { this.connected = false; this.closeEvent(reason); }
  onMessage(listener: (payload: Uint8Array) => void) { this.message = listener; return () => { this.message = () => {}; }; }
  onClose(listener: (reason: { code?: number; reason?: string }) => void) { this.closeEvent = listener; return () => { this.closeEvent = () => {}; }; }
  onError(listener: (error: unknown) => void) { this.errorEvent = listener; return () => { this.errorEvent = () => {}; }; }
  drop() { this.closeEvent({ code: 1006, reason: 'network' }); }
}

const auth: AuthProvider = { authenticate: async () => {} };

describe('RealSession lifecycle', () => {
  it('connects, authenticates, sends and closes through explicit states', async () => {
    const transport = new FakeTransport();
    const session = new RealSession('agent-1', transport, auth);
    expect(session.state).toBe('disconnected');
    await session.start();
    expect(session.state).toBe('online');
    await session.send(new Uint8Array([1, 2]));
    expect(transport.sent).toHaveLength(1);
    await session.close({ code: 1000, reason: 'done' });
    expect(session.state).toBe('disconnected');
  });

  it('moves to reconnecting after an unexpected close and can recover', async () => {
    const transport = new FakeTransport();
    const session = new RealSession('agent-1', transport, auth);
    await session.start();
    transport.drop();
    expect(session.state).toBe('reconnecting');
    await session.start();
    expect(session.state).toBe('online');
  });

  it('fails closed when authentication fails and blocks sending', async () => {
    const transport = new FakeTransport();
    const failingAuth: AuthProvider = { authenticate: async () => { throw new Error('bad credentials'); } };
    const session = new RealSession('agent-1', transport, failingAuth);
    await expect(session.start()).rejects.toBeInstanceOf(SessionError);
    expect(session.state).toBe('failed');
    await expect(session.send(new Uint8Array())).rejects.toBeInstanceOf(SessionError);
  });
});
