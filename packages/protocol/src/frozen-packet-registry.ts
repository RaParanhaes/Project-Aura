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
  frozenPacket({ name: 'UNIT_ACTION', direction: 'client_to_server', header: 2456, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserActionEvent', clientSymbol: 'RoomUnitActionComposer' }),
  frozenPacket({ name: 'UNIT_SIGN', direction: 'client_to_server', header: 1975, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserSignEvent', clientSymbol: 'RoomUnitSignComposer' }),
  frozenPacket({ name: 'UNIT_DANCE', direction: 'client_to_server', header: 2080, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserDanceEvent', clientSymbol: 'RoomUnitDanceComposer' }),
  frozenPacket({ name: 'UNIT_POSTURE', direction: 'client_to_server', header: 2235, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserSitEvent', clientSymbol: 'RoomUnitPostureComposer' }),
  frozenPacket({ name: 'UNIT_ORIENT', direction: 'client_to_server', header: 3301, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RoomUserLookAtPoint', clientSymbol: 'RoomUnitLookAtComposer' }),
  frozenPacket({ name: 'USER_PROFILE', direction: 'client_to_server', header: 3265, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RequestUserProfileEvent', clientSymbol: 'UserProfileRequestComposer' }),
  frozenPacket({ name: 'INVENTORY_ITEMS', direction: 'client_to_server', header: 3150, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RequestInventoryItemsEvent', clientSymbol: 'RequestInventoryItemsComposer' }),
  frozenPacket({ name: 'INVENTORY_BADGES', direction: 'client_to_server', header: 2769, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RequestInventoryBadgesEvent', clientSymbol: 'RequestInventoryBadgesComposer' }),
  frozenPacket({ name: 'CATALOG_PAGE', direction: 'client_to_server', header: 412, owner: 'composer', contractStatus: 'contract', serverSymbol: 'RequestCatalogPageEvent', clientSymbol: 'RequestCatalogPageComposer' }),
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
  frozenPacket({ name: 'ROOM_USER_ACTION', direction: 'server_to_client', header: 1631, owner: 'parser', contractStatus: 'contract', serverSymbol: 'RoomUserActionComposer', clientSymbol: 'RoomUserActionParser' }),
  frozenPacket({ name: 'ROOM_USER_DANCE', direction: 'server_to_client', header: 2233, owner: 'parser', contractStatus: 'contract', serverSymbol: 'RoomUserDanceComposer', clientSymbol: 'RoomUserDanceParser' }),
  frozenPacket({ name: 'USER_PROFILE', direction: 'server_to_client', header: 3898, owner: 'parser', contractStatus: 'contract', serverSymbol: 'UserProfileComposer', clientSymbol: 'UserProfileParser' }),
  frozenPacket({ name: 'INVENTORY_ITEMS', direction: 'server_to_client', header: 994, owner: 'parser', contractStatus: 'contract', serverSymbol: 'InventoryItemsComposer', clientSymbol: 'InventoryItemsParser' }),
  frozenPacket({ name: 'INVENTORY_BADGES', direction: 'server_to_client', header: 717, owner: 'parser', contractStatus: 'contract', serverSymbol: 'InventoryBadgesComposer', clientSymbol: 'InventoryBadgesParser' }),
  frozenPacket({ name: 'CATALOG_PAGE', direction: 'server_to_client', header: 804, owner: 'parser', contractStatus: 'contract', serverSymbol: 'CatalogPageComposer', clientSymbol: 'CatalogPageParser' }),
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
