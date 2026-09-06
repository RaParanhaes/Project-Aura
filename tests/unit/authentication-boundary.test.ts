import { describe, expect, it, vi } from 'vitest';
import { CredentialAuthProvider, type AuthHandshake, type CredentialProvider, type SessionTransport } from '../../packages/runtime/src/index.ts';

const transport = {} as SessionTransport;

describe('authentication boundary', () => {
  it('passes opaque credentials to the handshake and zeroizes them afterwards', async () => {
    const material = new Uint8Array([7, 8, 9]);
    const source: CredentialProvider = { getCredentials: async () => material };
    const sent = vi.fn(async (_transport: SessionTransport, credentials: Uint8Array) => {
      expect(credentials).toEqual(new Uint8Array([7, 8, 9]));
    });
    const handshake: AuthHandshake = { sendCredentials: sent, waitForAuthenticated: async () => {} };
    await new CredentialAuthProvider(source, handshake).authenticate(transport);
    expect(material).toEqual(new Uint8Array([0, 0, 0]));
    expect(sent).toHaveBeenCalledOnce();
  });

  it('zeroizes credentials even when the handshake fails', async () => {
    const material = new Uint8Array([1, 2]);
    const source: CredentialProvider = { getCredentials: async () => material };
    const handshake: AuthHandshake = {
      sendCredentials: async () => { throw new Error('rejected'); },
      waitForAuthenticated: async () => {}
    };
    await expect(new CredentialAuthProvider(source, handshake).authenticate(transport)).rejects.toThrow('rejected');
    expect(material).toEqual(new Uint8Array([0, 0]));
  });
});
