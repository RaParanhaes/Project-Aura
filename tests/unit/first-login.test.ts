import { describe, expect, it } from 'vitest';
import { CredentialAuthProvider, RealSession, firstLogin, type SessionTransport, type AuthHandshake, type CredentialProvider } from '../../packages/runtime/src/index.ts';

class LoginTransport implements SessionTransport {
  ready = false;
  async connect() { this.ready = true; }
  async send() {}
  async close() { this.ready = false; }
  onMessage() { return () => {}; }
  onClose() { return () => {}; }
  onError() { return () => {}; }
}

describe('first login flow', () => {
  it('reaches online only after transport and authentication complete', async () => {
    const transport = new LoginTransport();
    const source: CredentialProvider = { getCredentials: async () => new Uint8Array([1, 2, 3]) };
    const handshake: AuthHandshake = {
      sendCredentials: async () => { expect(transport.ready).toBe(true); },
      waitForAuthenticated: async () => {}
    };
    const session = new RealSession('agent-login', transport, new CredentialAuthProvider(source, handshake));
    await expect(firstLogin(session)).resolves.toEqual({ agentId: 'agent-login', state: 'online' });
  });
});
