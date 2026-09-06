import { PacketBodyError, encodePacketBody, parsePacketBody } from './packet-body.js';
import type { PacketFrame } from './packet-frame.js';
import { FROZEN_PACKET_REGISTRY } from './frozen-packet-registry.js';

const c2s = (name: string) => FROZEN_PACKET_REGISTRY.requireByName('client_to_server', name);
const s2c = (name: string) => FROZEN_PACKET_REGISTRY.requireByName('server_to_client', name);

const RELEASE_VERSION = c2s('RELEASE_VERSION');
const SECURITY_MACHINE = c2s('SECURITY_MACHINE');
const SECURITY_TICKET = c2s('SECURITY_TICKET');
const CLIENT_PONG = c2s('CLIENT_PONG');
const USER_INFO = c2s('USER_INFO');
const ROOM_ENTER = c2s('ROOM_ENTER');
const ROOM_ENTRY_DATA = c2s('ROOM_MODEL');
const AUTHENTICATED = s2c('AUTHENTICATED');
const CLIENT_PING = s2c('CLIENT_PING');
const USER_HOME_ROOM = s2c('USER_HOME_ROOM');
const ROOM_OPEN = s2c('ROOM_ENTER');

export class ClientHelloComposer {
  public readonly definition = RELEASE_VERSION;

  public constructor(
    private readonly releaseVersion = 'NITRO-3-6-0',
    private readonly type = 'HTML5',
    private readonly platform = 2,
    private readonly category = 1,
  ) {}

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, (writer) => {
      writer.writeString(this.releaseVersion);
      writer.writeString(this.type);
      writer.writeInt(this.platform);
      writer.writeInt(this.category);
    });
  }
}

export class UniqueIDComposer {
  public readonly definition = SECURITY_MACHINE;

  public constructor(
    private readonly machineId: string,
    private readonly fingerprint: string,
    private readonly flashVersion: string,
  ) {}

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, (writer) => {
      writer.writeString(this.machineId);
      writer.writeString(this.fingerprint);
      writer.writeString(this.flashVersion);
    });
  }
}

export class SSOTicketComposer {
  public readonly definition = SECURITY_TICKET;

  public constructor(
    private readonly ticket: string,
    private readonly timestamp: number,
    private readonly recoveryToken: string | null = '',
  ) {}

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, (writer) => {
      writer.writeString(this.ticket);
      writer.writeInt(this.timestamp);
      writer.writeString(this.recoveryToken ?? '');
    });
  }
}

export class PongComposer {
  public readonly definition = CLIENT_PONG;

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, () => undefined);
  }
}

export class InfoRetrieveComposer {
  public readonly definition = USER_INFO;

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, () => undefined);
  }
}

export class RoomEnterComposer {
  public readonly definition = ROOM_ENTER;

  public constructor(
    private readonly roomId: number,
    private readonly password: string | null = '',
    private readonly spawnX?: number,
    private readonly spawnY?: number,
  ) {
    if ((spawnX === undefined) !== (spawnY === undefined)) {
      throw new PacketBodyError('ROOM_ENTER', 'spawnX and spawnY must be provided together');
    }
  }

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, (writer) => {
      writer.writeInt(this.roomId).writeString(this.password ?? '');
      if (this.spawnX !== undefined && this.spawnY !== undefined) {
        writer.writeInt(this.spawnX).writeInt(this.spawnY);
      }
    });
  }
}

/** Completes the two-stage room-entry handshake after RoomOpen (758). */
export class RoomEntryDataComposer {
  public readonly definition = ROOM_ENTRY_DATA;

  public encode(): Uint8Array {
    return encodePacketBody(this.definition, () => undefined);
  }
}

export interface AuthenticatedPayload {
  readonly sessionResumed: boolean;
  readonly roomId: number;
  readonly recoveryToken: string;
}

export class AuthenticatedParser {
  public readonly definition = AUTHENTICATED;

  public parse(frame: PacketFrame): AuthenticatedPayload {
    return parsePacketBody(frame, this.definition, (reader) => ({
      sessionResumed: reader.readBoolean(),
      roomId: Math.max(reader.readInt(), 0),
      recoveryToken: reader.readString(),
    }));
  }
}

export class PingParser {
  public readonly definition = CLIENT_PING;

  public parse(frame: PacketFrame): void {
    parsePacketBody(frame, this.definition, () => undefined);
  }
}

export interface UserHomeRoomPayload {
  readonly homeRoom: number;
  readonly roomToEnter: number;
}

export class UserHomeRoomParser {
  public readonly definition = USER_HOME_ROOM;

  public parse(frame: PacketFrame): UserHomeRoomPayload {
    return parsePacketBody(frame, this.definition, (reader) => ({
      homeRoom: reader.readInt(),
      roomToEnter: reader.readInt(),
    }));
  }
}

export class RoomOpenParser {
  public readonly definition = ROOM_OPEN;

  public parse(frame: PacketFrame): void {
    parsePacketBody(frame, this.definition, () => undefined);
  }
}
