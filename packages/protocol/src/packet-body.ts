import { PacketProtocolError } from './errors.js';
import { createPacketFrame, type PacketFrame } from './packet-frame.js';
import { PacketReader } from './packet-reader.js';
import { PacketStreamCodec } from './packet-stream-codec.js';
import { PacketWriter } from './packet-writer.js';
import type { PacketDefinition } from './packet-definition.js';

export class PacketBodyError extends PacketProtocolError {
  public constructor(packetName: string, message: string) {
    super(`${packetName} body error: ${message}`);
  }
}

export function encodePacketBody(
  definition: PacketDefinition,
  writeBody: (writer: PacketWriter) => void,
): Uint8Array {
  if (definition.owner !== 'composer') {
    throw new PacketBodyError(definition.name, 'only composer definitions can be encoded');
  }
  const writer = new PacketWriter();
  writeBody(writer);
  return PacketStreamCodec.encode(createPacketFrame(definition.header, writer.toUint8Array()));
}

export function parsePacketBody<T>(
  frame: PacketFrame,
  definition: PacketDefinition,
  readBody: (reader: PacketReader) => T,
): T {
  if (definition.owner !== 'parser') {
    throw new PacketBodyError(definition.name, 'only parser definitions can be decoded');
  }
  if (frame.header !== definition.header) {
    throw new PacketBodyError(
      definition.name,
      `expected header ${definition.header}, received ${frame.header}`,
    );
  }

  const reader = new PacketReader(frame.body);
  const value = readBody(reader);
  if (reader.remaining !== 0) {
    throw new PacketBodyError(
      definition.name,
      `${reader.remaining} trailing byte(s) remain after parsing`,
    );
  }
  return value;
}
