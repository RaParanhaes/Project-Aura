import type { SessionCloseReason, SessionTransport, Unsubscribe } from './real-session.js';

export type WebSocketLike = {
  readonly readyState: number;
  binaryType: string;
  onopen: (() => void) | null;
  onmessage: ((event: { data: ArrayBuffer | Uint8Array }) => void) | null;
  onclose: ((event: { code: number; reason: string }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  send(data: Uint8Array): void;
  close(code?: number, reason?: string): void;
};

export type WebSocketFactory = (url: string) => WebSocketLike;

/** WebSocket adapter with no dependency on a particular WebSocket package. */
export class WebSocketSessionTransport implements SessionTransport {
  private socket: WebSocketLike | undefined;
  private readonly messages = new Set<(payload: Uint8Array) => void>();
  private readonly closes = new Set<(reason: SessionCloseReason) => void>();
  private readonly errors = new Set<(error: unknown) => void>();

  constructor(
    private readonly url: string,
    private readonly createSocket: WebSocketFactory
  ) {}

  connect(): Promise<void> {
    if (this.socket && this.socket.readyState === 1) return Promise.resolve();
    const socket = this.createSocket(this.url);
    this.socket = socket;
    socket.binaryType = 'arraybuffer';
    return new Promise((resolve, reject) => {
      socket.onopen = () => resolve();
      socket.onmessage = (event) => {
        const payload = event.data instanceof Uint8Array
          ? new Uint8Array(event.data)
          : new Uint8Array(event.data);
        for (const listener of this.messages) listener(payload);
      };
      socket.onclose = (event) => {
        for (const listener of this.closes) listener({ code: event.code, reason: event.reason });
      };
      socket.onerror = (event) => {
        for (const listener of this.errors) listener(event);
        reject(event);
      };
    });
  }

  async send(payload: Uint8Array): Promise<void> {
    if (!this.socket || this.socket.readyState !== 1) throw new Error('WebSocket is not open');
    this.socket.send(payload);
  }

  async close(reason?: SessionCloseReason): Promise<void> {
    this.socket?.close(reason?.code, reason?.reason);
    this.socket = undefined;
  }

  onMessage(listener: (payload: Uint8Array) => void): Unsubscribe {
    this.messages.add(listener); return () => this.messages.delete(listener);
  }
  onClose(listener: (reason: SessionCloseReason) => void): Unsubscribe {
    this.closes.add(listener); return () => this.closes.delete(listener);
  }
  onError(listener: (error: unknown) => void): Unsubscribe {
    this.errors.add(listener); return () => this.errors.delete(listener);
  }
}
