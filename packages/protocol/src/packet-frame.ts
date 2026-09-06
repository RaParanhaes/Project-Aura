import { PacketValueRangeError } from './errors.js';
import { PacketWriter } from './packet-writer.js';

export interface PacketFrame {
  readonly header: number;
  readonly body: Uint8Array;
}

export function createPacketFrame(
  header: number,
  body: Uint8Array = new Uint8Array(),
): PacketFrame {
  if (!Number.isInteger(header) || header < -0x8000 || header > 0x7fff) {
    throw new PacketValueRangeError('PacketFrame header', header);
  }

  return {
    header,
    body: body.slice(),
  };
}

export function encodePacketFrame(frame: PacketFrame): Uint8Array {
  const length = 2 + frame.body.byteLength;
  if (length > 0x7fffffff) {
    throw new PacketValueRangeError('PacketFrame length', length);
  }

  const writer = new PacketWriter();
  writer.writeInt(length).writeShort(frame.header).writeBytes(frame.body);
  return writer.toUint8Array();
}
