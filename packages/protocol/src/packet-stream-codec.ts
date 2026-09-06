import {
  InvalidPacketLengthError,
  PacketTooLargeError,
  PacketValueRangeError,
} from './errors.js';
import {
  createPacketFrame,
  encodePacketFrame,
  type PacketFrame,
} from './packet-frame.js';

const MAX_WIRE_PACKET_LENGTH = 0x7fffffff;

/**
 * Default adopted for the frozen F2 compatibility target. Runtime/session code may
 * override it when deployment configuration is introduced in later phases.
 */
export const DEFAULT_MAX_PACKET_LENGTH = 417_792;

export interface PacketStreamCodecOptions {
  maxPacketLength?: number;
}

export class PacketStreamCodec {
  private pending = new Uint8Array();
  public readonly maxPacketLength: number;

  public constructor(options: PacketStreamCodecOptions = {}) {
    const maxPacketLength = options.maxPacketLength ?? DEFAULT_MAX_PACKET_LENGTH;
    if (
      !Number.isSafeInteger(maxPacketLength) ||
      maxPacketLength < 2 ||
      maxPacketLength > MAX_WIRE_PACKET_LENGTH
    ) {
      throw new PacketValueRangeError('maxPacketLength', maxPacketLength);
    }
    this.maxPacketLength = maxPacketLength;
  }

  public push(chunk: Uint8Array): PacketFrame[] {
    if (chunk.byteLength > 0) {
      const combined = new Uint8Array(this.pending.byteLength + chunk.byteLength);
      combined.set(this.pending);
      combined.set(chunk, this.pending.byteLength);
      this.pending = combined;
    }

    const frames: PacketFrame[] = [];
    let offset = 0;

    while (this.pending.byteLength - offset >= 4) {
      const length = new DataView(
        this.pending.buffer,
        this.pending.byteOffset + offset,
        4,
      ).getInt32(0, false);

      if (length < 2) {
        throw new InvalidPacketLengthError(length);
      }
      if (length > this.maxPacketLength) {
        throw new PacketTooLargeError(length, this.maxPacketLength);
      }

      const packetEnd = offset + 4 + length;
      if (this.pending.byteLength < packetEnd) break;

      const packet = this.pending.slice(offset + 4, packetEnd);
      const view = new DataView(packet.buffer, packet.byteOffset, packet.byteLength);
      const header = view.getInt16(0, false);
      frames.push(createPacketFrame(header, packet.slice(2)));
      offset = packetEnd;
    }

    if (offset > 0) {
      this.pending = this.pending.slice(offset);
    }

    return frames;
  }

  public get remainder(): Uint8Array {
    return this.pending.slice();
  }

  public static encode(frame: PacketFrame): Uint8Array {
    return encodePacketFrame(frame);
  }
}
