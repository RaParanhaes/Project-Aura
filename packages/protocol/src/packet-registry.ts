import { PacketProtocolError } from './errors.js';
import type { PacketDefinition, PacketDirection } from './packet-definition.js';

export class DuplicatePacketHeaderError extends PacketProtocolError {
  public constructor(
    public readonly direction: PacketDirection,
    public readonly header: number,
  ) {
    super(`Duplicate ${direction} packet header: ${header}`);
  }
}

export class DuplicatePacketNameError extends PacketProtocolError {
  public constructor(
    public readonly direction: PacketDirection,
    public readonly packetName: string,
  ) {
    super(`Duplicate ${direction} packet name: ${packetName}`);
  }
}

export class UnknownPacketDefinitionError extends PacketProtocolError {
  public constructor(
    public readonly direction: PacketDirection,
    public readonly identity: number | string,
  ) {
    super(`Unknown ${direction} packet: ${String(identity)}`);
  }
}

function identityKey(direction: PacketDirection, identity: number | string): string {
  return `${direction}:${String(identity)}`;
}

export class PacketRegistry {
  private readonly registered: readonly PacketDefinition[];
  private readonly byHeader = new Map<string, PacketDefinition>();
  private readonly byName = new Map<string, PacketDefinition>();

  public constructor(definitions: readonly PacketDefinition[]) {
    for (const definition of definitions) {
      const headerKey = identityKey(definition.direction, definition.header);
      if (this.byHeader.has(headerKey)) {
        throw new DuplicatePacketHeaderError(definition.direction, definition.header);
      }

      const nameKey = identityKey(definition.direction, definition.name);
      if (this.byName.has(nameKey)) {
        throw new DuplicatePacketNameError(definition.direction, definition.name);
      }

      this.byHeader.set(headerKey, definition);
      this.byName.set(nameKey, definition);
    }

    this.registered = Object.freeze([...definitions]);
  }

  public get definitions(): readonly PacketDefinition[] {
    return this.registered;
  }

  public getByHeader(
    direction: PacketDirection,
    header: number,
  ): PacketDefinition | undefined {
    return this.byHeader.get(identityKey(direction, header));
  }

  public requireByHeader(direction: PacketDirection, header: number): PacketDefinition {
    const definition = this.getByHeader(direction, header);
    if (!definition) throw new UnknownPacketDefinitionError(direction, header);
    return definition;
  }

  public getByName(
    direction: PacketDirection,
    name: string,
  ): PacketDefinition | undefined {
    return this.byName.get(identityKey(direction, name));
  }

  public requireByName(direction: PacketDirection, name: string): PacketDefinition {
    const definition = this.getByName(direction, name);
    if (!definition) throw new UnknownPacketDefinitionError(direction, name);
    return definition;
  }
}
