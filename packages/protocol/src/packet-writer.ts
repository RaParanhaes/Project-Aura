import {
  PacketProtocolError,
  PacketStringTooLongError,
  PacketValueRangeError,
} from './errors.js';

interface TextEncoderLike {
  encode(input: string): Uint8Array;
}

const textEncoder = new (
  globalThis as unknown as {
    TextEncoder: new () => TextEncoderLike;
  }
).TextEncoder();

const BYTE_MIN = -0x80;
const BYTE_MAX = 0x7f;
const SHORT_MIN = -0x8000;
const SHORT_MAX = 0x7fff;
const INT_MIN = -0x80000000;
const INT_MAX = 0x7fffffff;
const LONG_MIN = -(1n << 63n);
const LONG_MAX = (1n << 63n) - 1n;

export class PacketWriter {
  private bytes = new Uint8Array(64);
  private offset = 0;

  public get length(): number {
    return this.offset;
  }

  public writeByte(value: number): this {
    this.assertIntegerInRange(value, BYTE_MIN, BYTE_MAX, 'writeByte');
    this.ensureCapacity(1);
    new DataView(this.bytes.buffer).setInt8(this.offset, value);
    this.offset += 1;
    return this;
  }

  public writeBoolean(value: boolean): this {
    return this.writeByte(value ? 1 : 0);
  }

  public writeShort(value: number): this {
    this.assertIntegerInRange(value, SHORT_MIN, SHORT_MAX, 'writeShort');
    this.ensureCapacity(2);
    new DataView(this.bytes.buffer).setInt16(this.offset, value, false);
    this.offset += 2;
    return this;
  }

  public writeInt(value: number): this {
    this.assertIntegerInRange(value, INT_MIN, INT_MAX, 'writeInt');
    this.ensureCapacity(4);
    new DataView(this.bytes.buffer).setInt32(this.offset, value, false);
    this.offset += 4;
    return this;
  }

  public writeLong(value: bigint): this {
    if (value < LONG_MIN || value > LONG_MAX) {
      throw new PacketValueRangeError('writeLong', value);
    }
    this.ensureCapacity(8);
    new DataView(this.bytes.buffer).setBigInt64(this.offset, value, false);
    this.offset += 8;
    return this;
  }

  public writeDouble(value: number): this {
    if (typeof value !== 'number') {
      throw new PacketProtocolError(`writeDouble received ${String(value)}`);
    }
    this.ensureCapacity(8);
    new DataView(this.bytes.buffer).setFloat64(this.offset, value, false);
    this.offset += 8;
    return this;
  }

  public writeString(value: string): this {
    const encoded = textEncoder.encode(value);
    if (encoded.byteLength > 0xffff) {
      throw new PacketStringTooLongError(encoded.byteLength);
    }
    this.writeUnsignedShort(encoded.byteLength);
    return this.writeBytes(encoded);
  }

  public writeBytes(value: Uint8Array): this {
    this.ensureCapacity(value.byteLength);
    this.bytes.set(value, this.offset);
    this.offset += value.byteLength;
    return this;
  }

  public toUint8Array(): Uint8Array {
    return this.bytes.slice(0, this.offset);
  }

  private writeUnsignedShort(value: number): void {
    this.ensureCapacity(2);
    new DataView(this.bytes.buffer).setUint16(this.offset, value, false);
    this.offset += 2;
  }

  private assertIntegerInRange(
    value: number,
    minimum: number,
    maximum: number,
    operation: string,
  ): void {
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
      throw new PacketValueRangeError(operation, value);
    }
  }

  private ensureCapacity(additionalBytes: number): void {
    const required = this.offset + additionalBytes;
    if (required <= this.bytes.byteLength) return;

    let capacity = this.bytes.byteLength;
    while (capacity < required) capacity *= 2;

    const expanded = new Uint8Array(capacity);
    expanded.set(this.bytes);
    this.bytes = expanded;
  }
}
