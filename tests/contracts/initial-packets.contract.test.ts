import { describe, expect, it } from 'vitest';
import {
  AuthenticatedParser,
  ClientHelloComposer,
  FROZEN_PACKET_REGISTRY,
  InfoRetrieveComposer,
  PacketReader,
  PacketStreamCodec,
  PingParser,
  PongComposer,
  RoomEnterComposer,
  RoomEntryDataComposer,
  RoomOpenParser,
  SSOTicketComposer,
  UniqueIDComposer,
  UserHomeRoomParser,
} from '../../packages/protocol/src/index.ts';
import { FROZEN_INITIAL_PACKET_FIXTURES as fixtures } from './frozen-initial-packet-fixtures.ts';

function bytes(hex: string): Uint8Array {
  const values = hex.match(/[0-9a-f]{2}/gu) ?? [];
  return new Uint8Array(values.map((value) => Number.parseInt(value, 16)));
}

function hex(value: Uint8Array): string {
  return Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function decodeFixture(hexValue: string) {
  const frames = new PacketStreamCodec().push(bytes(hexValue));
  expect(frames).toHaveLength(1);
  return frames[0]!;
}

describe('frozen initial packet contracts', () => {
  it('matches exact composer bytes for the first client session path', () => {
    expect(
      hex(new ClientHelloComposer(
        fixtures.clientHello.releaseVersion,
        fixtures.clientHello.type,
        fixtures.clientHello.platform,
        fixtures.clientHello.category,
      ).encode()),
    ).toBe(fixtures.clientHello.hex);
    expect(
      hex(new UniqueIDComposer(
        fixtures.machineIdentity.machineId,
        fixtures.machineIdentity.fingerprint,
        fixtures.machineIdentity.flashVersion,
      ).encode()),
    ).toBe(fixtures.machineIdentity.hex);
    expect(
      hex(new SSOTicketComposer(
        fixtures.ssoTicket.ticket,
        fixtures.ssoTicket.timestamp,
        fixtures.ssoTicket.recoveryToken,
      ).encode()),
    ).toBe(fixtures.ssoTicket.hex);
    expect(hex(new PongComposer().encode())).toBe(fixtures.pong);
    expect(hex(new InfoRetrieveComposer().encode())).toBe(fixtures.infoRetrieve);
    expect(hex(new RoomEnterComposer(42, '').encode())).toBe(fixtures.roomEnter);
    expect(hex(new RoomEnterComposer(42, 'pw', 3, 4).encode())).toBe(
      fixtures.roomEnterWithSpawn,
    );
    expect(hex(new RoomEntryDataComposer().encode())).toBe(fixtures.roomEntryData);
  });

  it('matches exact parser bytes and values for the first server session path', () => {
    expect(new AuthenticatedParser().parse(decodeFixture(fixtures.authenticated))).toEqual({
      sessionResumed: true,
      roomId: 0,
      recoveryToken: 'X',
    });
    expect(new UserHomeRoomParser().parse(decodeFixture(fixtures.userHomeRoom))).toEqual({
      homeRoom: 7,
      roomToEnter: 8,
    });
    expect(new PingParser().parse(decodeFixture(fixtures.ping))).toBeUndefined();
    expect(new RoomOpenParser().parse(decodeFixture(fixtures.roomOpen))).toBeUndefined();
  });

  it('keeps fixture fields aligned with their registered identity', () => {
    const expectations = [
      ['client_to_server', 'RELEASE_VERSION', 4000],
      ['client_to_server', 'SECURITY_MACHINE', 2490],
      ['client_to_server', 'SECURITY_TICKET', 2419],
      ['client_to_server', 'CLIENT_PONG', 2596],
      ['client_to_server', 'USER_INFO', 357],
      ['client_to_server', 'ROOM_ENTER', 2312],
      ['client_to_server', 'ROOM_MODEL', 2300],
      ['server_to_client', 'AUTHENTICATED', 2491],
      ['server_to_client', 'CLIENT_PING', 3928],
      ['server_to_client', 'USER_HOME_ROOM', 2875],
      ['server_to_client', 'ROOM_ENTER', 758],
    ] as const;

    for (const [direction, name, header] of expectations) {
      expect(FROZEN_PACKET_REGISTRY.requireByName(direction, name).header).toBe(header);
    }
  });

  it('parses the authenticated fixture with the primitive reader boundary', () => {
    const frame = decodeFixture(fixtures.authenticated);
    const reader = new PacketReader(frame.body);
    expect(reader.readBoolean()).toBe(true);
    expect(reader.readInt()).toBe(-1);
    expect(reader.readString()).toBe('X');
    expect(reader.remaining).toBe(0);
  });
});
