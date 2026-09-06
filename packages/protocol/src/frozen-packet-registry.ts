import {
  definePacket,
  type PacketCompatibility,
  type PacketContractStatus,
  type PacketDefinition,
  type PacketDirection,
  type PacketOwner,
} from './packet-definition.js';
import { PacketRegistry } from './packet-registry.js';

export const FROZEN_POLARIS_COMPATIBILITY = Object.freeze({
  schemaVersion: 2,
  contractSha256: 'fb8dd00dcaa7657b58781b835c0357fefc692797c1fabb9db5ba6770ce52d67b',
  polarisVersion: '4.2.82',
  clientRelease: 'NITRO-3-6-0',
}) satisfies PacketCompatibility;

interface FrozenPacketIdentity {
  readonly name: string;
  readonly direction: PacketDirection;
  readonly header: number;
  readonly owner: PacketOwner;
  readonly contractStatus: PacketContractStatus;
  readonly serverSymbol: string | null;
  readonly clientSymbol: string | null;
}

function frozenPacket(identity: FrozenPacketIdentity): PacketDefinition {
  return definePacket({
    ...identity,
    compatibility: FROZEN_POLARIS_COMPATIBILITY,
  });
}

/**
 * Packet identities required by the first session path. Body codecs use these definitions.
 * All numeric headers live here so later composers/parsers can depend on definitions.
 */
export const FROZEN_PACKET_DEFINITIONS = Object.freeze([
  frozenPacket({
    name: 'USER_INFO',
    direction: 'client_to_server',
    header: 357,
    owner: 'composer',
    contractStatus: 'contract',
    serverSymbol: 'RequestUserDataEvent',
    clientSymbol: 'InfoRetrieveMessageComposer',
  }),
  frozenPacket({
    name: 'ROOM_ENTER',
    direction: 'client_to_server',
    header: 2312,
    owner: 'composer',
    contractStatus: 'exemption',
    serverSymbol: 'RequestRoomLoadEvent',
    clientSymbol: 'RoomEnterComposer',
  }),
  frozenPacket({
    name: 'ROOM_MODEL',
    direction: 'client_to_server',
    header: 2300,
    owner: 'composer',
    contractStatus: 'contract',
    serverSymbol: 'RequestRoomHeightmapEvent',
    clientSymbol: 'GetRoomEntryDataMessageComposer',
  }),
  frozenPacket({ name: 'UNIT_TYPING_STOP', direction: 'client_to_server', header: 1474, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserStopTypingEvent', clientSymbol: 'RoomUnitTypingStopComposer' }),
  frozenPacket({ name: 'UNIT_TYPING', direction: 'client_to_server', header: 1597, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserStartTypingEvent', clientSymbol: 'RoomUnitTypingStartComposer' }),
  frozenPacket({ name: 'UNIT_CHAT', direction: 'client_to_server', header: 1314, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserTalkEvent', clientSymbol: 'RoomUnitChatComposer' }),
  frozenPacket({ name: 'UNIT_WHISPER', direction: 'client_to_server', header: 1543, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserWhisperEvent', clientSymbol: 'RoomUnitWhisperComposer' }),
  frozenPacket({ name: 'UNIT_SHOUT', direction: 'client_to_server', header: 2085, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserShoutEvent', clientSymbol: 'RoomUnitShoutComposer' }),
  frozenPacket({ name: 'UNIT_WALK', direction: 'client_to_server', header: 3320, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserWalkEvent', clientSymbol: 'RoomUnitWalkComposer' }),
  frozenPacket({ name: 'ENABLE_EFFECT', direction: 'client_to_server', header: 1752, owner: 'composer', contractStatus: 'contract', serverSymbol: 'EnableEffectEvent', clientSymbol: 'EnableEffectComposer' }),
  frozenPacket({
    name: 'SECURITY_TICKET',
    direction: 'client_to_server',
    header: 2419,
    owner: 'composer',
    contractStatus: 'contract',
    serverSymbol: 'SecureLoginEvent',
    clientSymbol: 'SSOTicketMessageComposer',
  }),
  frozenPacket({
    name: 'SECURITY_MACHINE',
    direction: 'client_to_server',
    header: 2490,
    owner: 'composer',
    contractStatus: 'contract',
    serverSymbol: 'MachineIDEvent',
    clientSymbol: 'UniqueIDMessageComposer',
  }),
  frozenPacket({
    name: 'CLIENT_PONG',
    direction: 'client_to_server',
    header: 2596,
    owner: 'composer',
    contractStatus: 'unpaired',
    serverSymbol: 'PongEvent',
    clientSymbol: 'PongMessageComposer',
  }),
  frozenPacket({
    name: 'RELEASE_VERSION',
    direction: 'client_to_server',
    header: 4000,
    owner: 'composer',
    contractStatus: 'exemption',
    serverSymbol: 'ReleaseVersionEvent',
    clientSymbol: 'ClientHelloMessageComposer',
  }),
  frozenPacket({
    name: 'ROOM_ENTER',
    direction: 'server_to_client',
    header: 758,
    owner: 'parser',
    contractStatus: 'contract',
    serverSymbol: 'RoomOpenComposer',
    clientSymbol: 'RoomEnterParser',
  }),
  frozenPacket({
    name: 'AUTHENTICATED',
    direction: 'server_to_client',
    header: 2491,
    owner: 'parser',
    contractStatus: 'contract',
    serverSymbol: 'SecureLoginOKComposer',
    clientSymbol: 'AuthenticatedParser',
  }),
  frozenPacket({
    name: 'USER_HOME_ROOM',
    direction: 'server_to_client',
    header: 2875,
    owner: 'parser',
    contractStatus: 'contract',
    serverSymbol: 'UserHomeRoomComposer',
    clientSymbol: 'NavigatorHomeRoomParser',
  }),
  frozenPacket({
    name: 'CLIENT_PING',
    direction: 'server_to_client',
    header: 3928,
    owner: 'parser',
    contractStatus: 'contract',
    serverSymbol: 'PingComposer',
    clientSymbol: 'ClientPingParser',
  }),
  frozenPacket({ name: 'UNIT_STATUS', direction: 'server_to_client', header: 1640, owner: 'parser', contractStatus: 'contract', serverSymbol: 'RoomUserStatusComposer', clientSymbol: 'RoomUnitStatusParser' }),
  frozenPacket({ name: 'ROOM_USER_EFFECT', direction: 'server_to_client', header: 1167, owner: 'parser', contractStatus: 'contract', serverSymbol: 'RoomUserEffectComposer', clientSymbol: 'RoomUserEffectParser' }),
  frozenPacket({
    name: 'DISCONNECT_REASON',
    direction: 'server_to_client',
    header: 4000,
    owner: 'parser',
    contractStatus: 'exemption',
    serverSymbol: 'ErrorLoginComposer',
    clientSymbol: 'DisconnectReasonParser',
  }),
] satisfies readonly PacketDefinition[]);

export const FROZEN_PACKET_REGISTRY = new PacketRegistry(FROZEN_PACKET_DEFINITIONS);
