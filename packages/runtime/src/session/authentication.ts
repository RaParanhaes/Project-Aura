import type { AuthProvider, SessionTransport } from './real-session.js';

/** Supplies short-lived authentication material without exposing its source. */
export interface CredentialProvider {
  getCredentials(): Promise<Uint8Array>;
}

/** Runtime-owned handshake port; packet composition stays in the protocol adapter. */
export interface AuthHandshake {
  sendCredentials(transport: SessionTransport, credentials: Uint8Array): Promise<void>;
  waitForAuthenticated(): Promise<void>;
}

/** Bridges an external CMS/SSO credential source to the session lifecycle. */
export class CredentialAuthProvider implements AuthProvider {
  constructor(
    private readonly credentials: CredentialProvider,
    private readonly handshake: AuthHandshake
  ) {}

  async authenticate(transport: SessionTransport): Promise<void> {
    const material = await this.credentials.getCredentials();
    try {
      await this.handshake.sendCredentials(transport, material);
      await this.handshake.waitForAuthenticated();
    } finally {
      material.fill(0);
    }
  }
}
