import { PacketProtocolError, PacketValueRangeError } from './errors.js';

export const PACKET_DIRECTIONS = [
  'client_to_server',
  'server_to_client',
] as const;

export type PacketDirection = (typeof PACKET_DIRECTIONS)[number];

export type PacketOwner = 'composer' | 'parser';

export type PacketContractStatus = 'contract' | 'exemption' | 'unpaired';

export interface PacketCompatibility {
  readonly schemaVersion: number;
  readonly contractSha256: string;
  readonly polarisVersion: string;
  readonly clientRelease: string;
}

export interface PacketDefinition {
  readonly name: string;
  readonly direction: PacketDirection;
  readonly header: number;
  readonly owner: PacketOwner;
  readonly contractStatus: PacketContractStatus;
  readonly serverSymbol: string | null;
  readonly clientSymbol: string | null;
  readonly compatibility: PacketCompatibility;
}

export type PacketDefinitionInput = Omit<PacketDefinition, 'compatibility'> & {
  readonly compatibility: PacketCompatibility;
};

export class InvalidPacketDefinitionError extends PacketProtocolError {}

export function ownerForDirection(direction: PacketDirection): PacketOwner {
  return direction === 'client_to_server' ? 'composer' : 'parser';
}

export function definePacket(input: PacketDefinitionInput): PacketDefinition {
  if (!input.name.trim()) {
    throw new InvalidPacketDefinitionError('Packet definition name must not be empty');
  }
  if (!PACKET_DIRECTIONS.includes(input.direction)) {
    throw new InvalidPacketDefinitionError(
      `Packet ${input.name} has invalid direction: ${String(input.direction)}`,
    );
  }
  if (!Number.isInteger(input.header) || input.header < 0 || input.header > 0x7fff) {
    throw new PacketValueRangeError(`Packet ${input.name} header`, input.header);
  }

  const expectedOwner = ownerForDirection(input.direction);
  if (input.owner !== expectedOwner) {
    throw new InvalidPacketDefinitionError(
      `Packet ${input.name} direction ${input.direction} must be owned by a ${expectedOwner}`,
    );
  }
  if (
    !Number.isInteger(input.compatibility.schemaVersion) ||
    input.compatibility.schemaVersion < 1
  ) {
    throw new InvalidPacketDefinitionError(
      `Packet ${input.name} has invalid contract schema version`,
    );
  }
  if (!/^[0-9a-f]{64}$/u.test(input.compatibility.contractSha256)) {
    throw new InvalidPacketDefinitionError(
      `Packet ${input.name} has invalid contract SHA-256`,
    );
  }

  return Object.freeze({
    ...input,
    name: input.name.trim(),
    compatibility: Object.freeze({ ...input.compatibility }),
  });
}
