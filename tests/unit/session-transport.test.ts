import { describe, expect, it, vi } from 'vitest';
import { HeartbeatController, WebSocketSessionTransport, type WebSocketLike } from '../../packages/runtime/src/index.ts';

class FakeSocket implements WebSocketLike {
  readyState = 0; binaryType = ''; onopen = null; onmessage = null; onclose = null; onerror = null;
  sent: Uint8Array[] = [];
  send(data: Uint8Array) { this.sent.push(data); }
  close(code?: number, reason?: string) { this.readyState = 3; this.onclose?.({ code: code ?? 1000, reason: reason ?? '' }); }
  open() { this.readyState = 1; this.onopen?.(); }
  receive(data: Uint8Array) { this.onmessage?.({ data }); }
}

describe('WebSocketSessionTransport', () => {
  it('connects, dispatches binary messages and sends payloads', async () => {
    const socket = new FakeSocket();
    const transport = new WebSocketSessionTransport('ws://hotel', () => socket);
    const received: Uint8Array[] = [];
    transport.onMessage((payload) => received.push(payload));
    const connecting = transport.connect();
    socket.open();
    await connecting;
    await transport.send(new Uint8Array([1, 2]));
    socket.receive(new Uint8Array([3, 4]));
    expect(socket.binaryType).toBe('arraybuffer');
    expect(socket.sent[0]).toEqual(new Uint8Array([1, 2]));
    expect(received[0]).toEqual(new Uint8Array([3, 4]));
  });
});

describe('HeartbeatController', () => {
  it('sends pings and times out without activity', () => {
    vi.useFakeTimers();
    const sendPing = vi.fn();
    const onTimeout = vi.fn();
    const heartbeat = new HeartbeatController({ intervalMs: 1000, timeoutMs: 2500, sendPing, onTimeout });
    heartbeat.start();
    vi.advanceTimersByTime(1000);
    expect(sendPing).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
    heartbeat.stop();
    vi.useRealTimers();
  });
});
