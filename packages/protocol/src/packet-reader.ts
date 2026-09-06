import { PacketBoundsError, PacketProtocolError } from './errors.js';

interface TextDecoderLike {
  decode(input: Uint8Array): string;
}

const textDecoder = new (
  globalThis as unknown as {
    TextDecoder: new (encoding: string, options: { fatal: boolean }) => TextDecoderLike;
  }
).TextDecoder('utf-8', { fatal: true });

export class PacketReader {
  private readonly view: DataView;
  private readonly bytes: Uint8Array;
  private offset = 0;

  public constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  public get position(): number {
    return this.offset;
  }

  public get remaining(): number {
    return this.bytes.byteLength - this.offset;
  }

  public get bytesRemaining(): number {
    return this.remaining;
  }

  public readByte(): number {
    this.require(1, 'readByte');
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  public readBoolean(): boolean {
    const value = this.readByte();
    if (value !== 0 && value !== 1) {
      throw new PacketProtocolError(
        `readBoolean received an invalid wire value: ${value}`,
      );
    }
    return value === 1;
  }

  public readShort(): number {
    this.require(2, 'readShort');
    const value = this.view.getInt16(this.offset, false);
    this.offset += 2;
    return value;
  }

  public readInt(): number {
    this.require(4, 'readInt');
    const value = this.view.getInt32(this.offset, false);
    this.offset += 4;
    return value;
  }

  public readLong(): bigint {
    this.require(8, 'readLong');
    const value = this.view.getBigInt64(this.offset, false);
    this.offset += 8;
    return value;
  }

  public readDouble(): number {
    this.require(8, 'readDouble');
    const value = this.view.getFloat64(this.offset, false);
    this.offset += 8;
    return value;
  }

  public readString(): string {
    this.require(2, 'readString length');
    const byteLength = this.view.getUint16(this.offset, false);
    this.offset += 2;
    const value = this.readBytes(byteLength);

    try {
      return textDecoder.decode(value);
    } catch (error) {
      throw new PacketProtocolError(
        `readString received invalid UTF-8: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  public readBytes(length: number): Uint8Array {
    if (!Number.isSafeInteger(length) || length < 0) {
      throw new PacketProtocolError(
        `readBytes requires a non-negative safe integer length, received ${length}`,
      );
    }

    this.require(length, 'readBytes');
    const value = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  private require(length: number, operation: string): void {
    if (this.remaining < length) {
      throw new PacketBoundsError(operation, length, this.remaining);
    }
  }
}
