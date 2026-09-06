export type SessionState =
  | 'disconnected'
  | 'connecting'
  | 'authenticating'
  | 'online'
  | 'reconnecting'
  | 'failed';

export type SessionCloseReason = {
  code?: number;
  reason?: string;
};

export type Unsubscribe = () => void;

/** Transport boundary; socket details belong to a later adapter. */
export interface SessionTransport {
  connect(): Promise<void>;
  send(payload: Uint8Array): Promise<void>;
  close(reason?: SessionCloseReason): Promise<void>;
  onMessage(listener: (payload: Uint8Array) => void): Unsubscribe;
  onClose(listener: (reason: SessionCloseReason) => void): Unsubscribe;
  onError(listener: (error: unknown) => void): Unsubscribe;
}

/** Authentication remains outside the transport and protocol packages. */
export interface AuthProvider {
  authenticate(transport: SessionTransport): Promise<void>;
}

export class SessionError extends Error {
  override readonly name = 'SessionError';

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}

export class RealSession {
  private readonly unsubscribe: Unsubscribe[];
  private _state: SessionState = 'disconnected';
  private failure: unknown;

  constructor(
    readonly agentId: string,
    private readonly transport: SessionTransport,
    private readonly auth: AuthProvider,
    private readonly onMessage: (payload: Uint8Array) => void = () => {}
  ) {
    this.unsubscribe = [
      transport.onMessage((payload) => this.onMessage(payload)),
      transport.onClose((reason) => this.handleClose(reason)),
      transport.onError((error) => this.handleError(error))
    ];
  }

  get state(): SessionState {
    return this._state;
  }

  get error(): unknown {
    return this.failure;
  }

  async start(): Promise<void> {
    if (this._state !== 'disconnected' && this._state !== 'reconnecting') {
      throw new SessionError(`Cannot start a session from ${this._state}`);
    }

    this.transition(this._state === 'reconnecting' ? 'reconnecting' : 'connecting');
    try {
      await this.transport.connect();
      this.transition('authenticating');
      await this.auth.authenticate(this.transport);
      this.failure = undefined;
      this.transition('online');
    } catch (error) {
      this.failure = error;
      this.transition('failed');
      throw new SessionError('Session startup failed', { cause: error });
    }
  }

  async reconnect(): Promise<void> {
    if (this._state !== 'failed' && this._state !== 'disconnected') {
      throw new SessionError(`Cannot reconnect a session from ${this._state}`);
    }
    this.transition('reconnecting');
    await this.start();
  }

  async send(payload: Uint8Array): Promise<void> {
    if (this._state !== 'online') {
      throw new SessionError(`Cannot send while session is ${this._state}`);
    }
    await this.transport.send(payload);
  }

  async close(reason?: SessionCloseReason): Promise<void> {
    if (this._state === 'disconnected') return;
    await this.transport.close(reason);
    this.transition('disconnected');
  }

  dispose(): void {
    for (const remove of this.unsubscribe) remove();
    this.unsubscribe.length = 0;
  }

  private handleClose(_reason: SessionCloseReason): void {
    if (this._state === 'online' || this._state === 'authenticating') {
      this.transition('reconnecting');
    }
  }

  private handleError(error: unknown): void {
    this.failure = error;
    if (this._state !== 'disconnected') this.transition('failed');
  }

  private transition(next: SessionState): void {
    this._state = next;
  }
}
