// @ts-nocheck
import { randomBytes } from 'node:crypto';
import { connect, type Socket } from 'node:net';

/** Minimal binary WebSocket client for opt-in local integration tests. */
export class OriginWebSocket {
  public readyState = 0;
  public binaryType = 'arraybuffer';
  public onopen: (() => void) | null = null;
  public onmessage: ((event: { data: ArrayBuffer }) => void) | null = null;
  public onclose: ((event: { code: number; reason: string }) => void) | null = null;
  public onerror: ((event: unknown) => void) | null = null;

  private readonly socket: Socket;
  private buffer = Buffer.alloc(0);
  private upgraded = false;

  public constructor(urlValue: string) {
    const url = new URL(urlValue);
    const port = Number(url.port || 80);
    const key = randomBytes(16).toString('base64');
    this.socket = connect({ host: url.hostname, port }, () => {
      this.socket.write([
        `GET ${url.pathname || '/'} HTTP/1.1`,
        `Host: ${url.host}`,
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Key: ${key}`,
        'Sec-WebSocket-Version: 13',
        'Origin: http://localhost',
        '',
        '',
      ].join('\r\n'));
    });
    this.socket.on('data', chunk => this.consume(chunk));
    this.socket.on('error', error => this.onerror?.(error));
    this.socket.on('close', () => {
      this.readyState = 3;
      this.onclose?.({ code: 1006, reason: 'socket closed' });
    });
  }

  public send(data: Uint8Array): void {
    if (this.readyState !== 1) throw new Error('WebSocket is not open');
    this.writeFrame(Buffer.from(data), 0x2);
  }

  public close(_code?: number, _reason?: string): void {
    if (this.readyState >= 2) return;
    this.readyState = 2;
    this.socket.end();
  }

  private consume(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    if (!this.upgraded) {
      const end = this.buffer.indexOf('\r\n\r\n');
      if (end < 0) return;
      const response = this.buffer.subarray(0, end).toString('ascii');
      this.buffer = this.buffer.subarray(end + 4);
      if (!response.startsWith('HTTP/1.1 101')) {
        this.onerror?.(new Error(`WebSocket upgrade failed: ${response.split('\r\n')[0]}`));
        return;
      }
      this.upgraded = true;
      this.readyState = 1;
      this.onopen?.();
    }

    while (this.buffer.length >= 2) {
      const opcode = this.buffer[0]! & 0x0f;
      let length = this.buffer[1]! & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (this.buffer.length < 4) return;
        length = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (this.buffer.length < 10) return;
        const extended = this.buffer.readBigUInt64BE(2);
        if (extended > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('WebSocket frame too large');
        length = Number(extended);
        offset = 10;
      }
      if (this.buffer.length < offset + length) return;

      const payload = this.buffer.subarray(offset, offset + length);
      this.buffer = this.buffer.subarray(offset + length);
      if (opcode === 0x2) {
        const copy = Uint8Array.from(payload);
        this.onmessage?.({ data: copy.buffer });
      } else if (opcode === 0x9) {
        this.writeFrame(payload, 0xa);
      } else if (opcode === 0x8) {
        this.close();
        return;
      }
    }
  }

  private writeFrame(payload: Buffer, opcode: number): void {
    const extendedBytes = payload.length < 126 ? 0 : 2;
    const header = Buffer.alloc(2 + extendedBytes + 4);
    header[0] = 0x80 | opcode;
    if (extendedBytes === 0) {
      header[1] = 0x80 | payload.length;
    } else {
      header[1] = 0x80 | 126;
      header.writeUInt16BE(payload.length, 2);
    }
    const maskOffset = 2 + extendedBytes;
    const mask = randomBytes(4);
    mask.copy(header, maskOffset);
    const masked = Buffer.alloc(payload.length);
    for (let index = 0; index < payload.length; index += 1) {
      masked[index] = payload[index]! ^ mask[index % 4]!;
    }
    this.socket.write(Buffer.concat([header, masked]));
  }
}
