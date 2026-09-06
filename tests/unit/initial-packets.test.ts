import { describe, expect, it } from 'vitest';
import {
  AuthenticatedParser,
  ClientHelloComposer,
  InfoRetrieveComposer,
  PacketBodyError,
  PacketStreamCodec,
  PingParser,
  PongComposer,
  RoomEnterComposer,
  RoomOpenParser,
  SSOTicketComposer,
  UniqueIDComposer,
  UserHomeRoomParser,
} from '../../packages/protocol/src/index.ts';

function frame(bytes: Uint8Array) {
  const decoded = new PacketStreamCodec().push(bytes);
  expect(decoded).toHaveLength(1);
  return decoded[0]!;
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

describe('initial packet composers', () => {
  it('encodes the renderer-compatible ClientHello fields', () => {
    const decoded = frame(new ClientHelloComposer().encode());
    expect(decoded.header).toBe(4000);
    expect(decoded.body.byteLength).toBe(28);
  });

  it('encodes machine identity and SSO ticket fields', () => {
    expect(hex(new UniqueIDComposer('machine', 'fingerprint', 'flash').encode())).toBe(
      '0000001f09ba0007' +
        '6d616368696e65' +
        '000b66696e6765727072696e74' +
        '0005666c617368',
    );
    expect(hex(new SSOTicketComposer('ticket', 123, '').encode())).toBe(
      '00000010097300067469636b65740000007b0000',
    );
  });

  it('encodes bodyless keepalive and user-info packets', () => {
    expect(hex(new PongComposer().encode())).toBe('000000020a24');
    expect(hex(new InfoRetrieveComposer().encode())).toBe('000000020165');
  });

  it('encodes room entry with optional spawn coordinates', () => {
    expect(hex(new RoomEnterComposer(42, '').encode())).toBe('0000000809080000002a0000');
    expect(hex(new RoomEnterComposer(42, 'pw', 3, 4).encode())).toBe(
      '0000001209080000002a000270770000000300000004',
    );
    expect(() => new RoomEnterComposer(42, '', 3)).toThrow(PacketBodyError);
  });
});

describe('initial packet parsers', () => {
  it('parses Authenticated with strict fields and server room-id normalization', () => {
    const encoded = new Uint8Array([
      0, 0, 0, 10,
      9, 187,
      1,
      255, 255, 255, 255,
      0, 1, 88,
    ]);
    expect(new AuthenticatedParser().parse(frame(encoded))).toEqual({
      sessionResumed: true,
      roomId: 0,
      recoveryToken: 'X',
    });
  });

  it('parses UserHomeRoom and accepts bodyless server packets', () => {
    const encoded = new Uint8Array([0, 0, 0, 10, 11, 59, 0, 0, 0, 7, 0, 0, 0, 8]);
    expect(new UserHomeRoomParser().parse(frame(encoded))).toEqual({
      homeRoom: 7,
      roomToEnter: 8,
    });
    expect(new PingParser().parse(frame(new Uint8Array([0, 0, 0, 2, 15, 88])))).toBeUndefined();
    expect(new RoomOpenParser().parse(frame(new Uint8Array([0, 0, 0, 2, 2, 246])))).toBeUndefined();
  });

  it('rejects wrong headers and trailing body bytes', () => {
    const pong = frame(new PongComposer().encode());
    expect(() => new PingParser().parse(pong)).toThrow(PacketBodyError);
    const malformed = frame(new Uint8Array([0, 0, 0, 3, 15, 88, 1]));
    expect(() => new PingParser().parse(malformed)).toThrow(PacketBodyError);
  });
});
