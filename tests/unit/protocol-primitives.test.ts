import { describe, expect, it } from 'vitest';
import {
  InvalidPacketLengthError,
  PacketBoundsError,
  PacketProtocolError,
  PacketReader,
  PacketStreamCodec,
  PacketStringTooLongError,
  PacketTooLargeError,
  PacketValueRangeError,
  PacketWriter,
  createPacketFrame,
} from '../../packages/protocol/src/index.ts';

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

describe('PacketReader and PacketWriter', () => {
  it('round-trips supported primitives with big-endian wire encoding', () => {
    const writer = new PacketWriter();
    writer
      .writeByte(-1)
      .writeBoolean(false)
      .writeBoolean(true)
      .writeShort(0x1234)
      .writeShort(-2)
      .writeInt(0x12345678)
      .writeInt(-2)
      .writeLong(9_007_199_254_740_993n)
      .writeDouble(Math.PI)
      .writeString('AURA')
      .writeString('ação 🤖')
      .writeString('')
      .writeBytes(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));

    const reader = new PacketReader(writer.toUint8Array());
    expect(reader.readByte()).toBe(-1);
    expect(reader.readBoolean()).toBe(false);
    expect(reader.readBoolean()).toBe(true);
    expect(reader.readShort()).toBe(0x1234);
    expect(reader.readShort()).toBe(-2);
    expect(reader.readInt()).toBe(0x12345678);
    expect(reader.readInt()).toBe(-2);
    expect(reader.readLong()).toBe(9_007_199_254_740_993n);
    expect(reader.readDouble()).toBe(Math.PI);
    expect(reader.readString()).toBe('AURA');
    expect(reader.readString()).toBe('ação 🤖');
    expect(reader.readString()).toBe('');
    expect(hex(reader.readBytes(4))).toBe('deadbeef');
    expect(reader.position).toBe(writer.length);
    expect(reader.remaining).toBe(0);
  });

  it('uses UTF-8 byte length rather than JavaScript character length', () => {
    const writer = new PacketWriter().writeString('🤖');
    expect(hex(writer.toUint8Array())).toBe('0004f09fa496');
  });

  it('rejects reads that exceed the available bytes', () => {
    expect(() => new PacketReader(new Uint8Array(3)).readInt()).toThrow(
      PacketBoundsError,
    );
    expect(() => new PacketReader(new Uint8Array([0, 3, 0])).readString()).toThrow(
      PacketBoundsError,
    );
    expect(() => new PacketReader(new Uint8Array([1])).readBytes(2)).toThrow(
      PacketBoundsError,
    );
  });

  it('rejects invalid primitive values instead of truncating them', () => {
    expect(() => new PacketWriter().writeByte(128)).toThrow(PacketValueRangeError);
    expect(() => new PacketWriter().writeShort(0x8000)).toThrow(
      PacketValueRangeError,
    );
    expect(() => new PacketWriter().writeInt(0x1_0000_0000)).toThrow(
      PacketValueRangeError,
    );
    expect(() => new PacketWriter().writeLong(1n << 63n)).toThrow(
      PacketValueRangeError,
    );
  });

  it('rejects strings whose UTF-8 representation exceeds the wire limit', () => {
    expect(() => new PacketWriter().writeString('a'.repeat(0x1_0000))).toThrow(
      PacketStringTooLongError,
    );
  });

  it('rejects boolean wire values other than zero and one', () => {
    expect(() => new PacketReader(new Uint8Array([2])).readBoolean()).toThrow(
      /invalid wire value/,
    );
  });

  it('rejects malformed UTF-8 strings', () => {
    expect(() => new PacketReader(new Uint8Array([0, 1, 0xff])).readString()).toThrow(
      PacketProtocolError,
    );
  });
});

describe('PacketStreamCodec', () => {
  it('encodes a bodyless frame with length equal to the two-byte header', () => {
    const encoded = PacketStreamCodec.encode(createPacketFrame(4000));
    expect(hex(encoded)).toBe('000000020fa0');
  });

  it('encodes a frame with an exact length/header/body layout', () => {
    const encoded = PacketStreamCodec.encode(
      createPacketFrame(0x1234, new Uint8Array([0xab, 0xcd])),
    );
    expect(hex(encoded)).toBe('000000041234abcd');
  });

  it('decodes a packet only after all fragmented bytes arrive', () => {
    const codec = new PacketStreamCodec();
    const encoded = PacketStreamCodec.encode(
      createPacketFrame(4000, new Uint8Array([1, 2, 3])),
    );

    expect(codec.push(encoded.slice(0, 1))).toEqual([]);
    expect(codec.push(encoded.slice(1, 4))).toEqual([]);
    expect(codec.push(encoded.slice(4, 6))).toEqual([]);
    expect(codec.push(encoded.slice(6))).toEqual([
      { header: 4000, body: new Uint8Array([1, 2, 3]) },
    ]);
  });

  it('decodes multiple packets and preserves a complete-plus-incomplete remainder', () => {
    const codec = new PacketStreamCodec();
    const first = PacketStreamCodec.encode(createPacketFrame(1));
    const second = PacketStreamCodec.encode(createPacketFrame(2, new Uint8Array([9])));
    const third = PacketStreamCodec.encode(createPacketFrame(3, new Uint8Array([8, 7])));
    const result = codec.push(
      new Uint8Array([...first, ...second, ...third.slice(0, 5)]),
    );

    expect(result).toEqual([
      { header: 1, body: new Uint8Array() },
      { header: 2, body: new Uint8Array([9]) },
    ]);
    expect(hex(codec.remainder)).toBe(hex(third.slice(0, 5)));
    expect(codec.push(third.slice(5))).toEqual([
      { header: 3, body: new Uint8Array([8, 7]) },
    ]);
    expect(codec.remainder).toHaveLength(0);
  });

  it('waits when only part of the four-byte length prefix is available', () => {
    const codec = new PacketStreamCodec();
    expect(codec.push(new Uint8Array([0]))).toEqual([]);
    expect(codec.push(new Uint8Array([0, 0]))).toEqual([]);
    expect(codec.push(new Uint8Array([2]))).toEqual([]);
  });

  it('rejects lengths below the two-byte header', () => {
    expect(() => new PacketStreamCodec().push(new Uint8Array([0, 0, 0, 1]))).toThrow(
      InvalidPacketLengthError,
    );
  });

  it('rejects packets above the configured maximum', () => {
    expect(() =>
      new PacketStreamCodec({ maxPacketLength: 2 }).push(
        new Uint8Array([0, 0, 0, 3]),
      ),
    ).toThrow(PacketTooLargeError);
  });

  it('rejects a configured maximum outside the signed wire-length range', () => {
    expect(() => new PacketStreamCodec({ maxPacketLength: 0x80000000 })).toThrow(
      PacketValueRangeError,
    );
  });

  it('rejects an out-of-range frame header', () => {
    expect(() => createPacketFrame(0x8000)).toThrow(PacketValueRangeError);
  });
});
