import { describe, expect, it } from 'vitest';
import {
  DuplicatePacketHeaderError,
  DuplicatePacketNameError,
  FROZEN_PACKET_DEFINITIONS,
  FROZEN_PACKET_REGISTRY,
  FROZEN_POLARIS_COMPATIBILITY,
  InvalidPacketDefinitionError,
  PacketRegistry,
  PacketValueRangeError,
  UnknownPacketDefinitionError,
  definePacket,
  type PacketDefinitionInput,
} from '../../packages/protocol/src/index.ts';

function definition(
  overrides: Partial<PacketDefinitionInput> = {},
): PacketDefinitionInput {
  return {
    name: 'TEST_PACKET',
    direction: 'client_to_server',
    header: 100,
    owner: 'composer',
    contractStatus: 'contract',
    serverSymbol: 'TestEvent',
    clientSymbol: 'TestComposer',
    compatibility: FROZEN_POLARIS_COMPATIBILITY,
    ...overrides,
  };
}

describe('Packet definitions', () => {
  it('records the frozen schema-2 compatibility identity', () => {
    expect(FROZEN_POLARIS_COMPATIBILITY).toEqual({
      schemaVersion: 2,
      contractSha256:
        'fb8dd00dcaa7657b58781b835c0357fefc692797c1fabb9db5ba6770ce52d67b',
      polarisVersion: '4.2.82',
      clientRelease: 'NITRO-3-6-0',
    });
  });

  it('rejects headers outside the non-negative signed-short range', () => {
    expect(() => definePacket(definition({ header: -1 }))).toThrow(
      PacketValueRangeError,
    );
    expect(() => definePacket(definition({ header: 0x8000 }))).toThrow(
      PacketValueRangeError,
    );
  });

  it('enforces composer/parser ownership from packet direction', () => {
    expect(() => definePacket(definition({ owner: 'parser' }))).toThrow(
      InvalidPacketDefinitionError,
    );
    expect(() =>
      definePacket(
        definition({
          direction: 'server_to_client',
          owner: 'composer',
        }),
      ),
    ).toThrow(InvalidPacketDefinitionError);
  });
});

describe('PacketRegistry', () => {
  it('looks up frozen packet identities by direction, header and logical name', () => {
    expect(
      FROZEN_PACKET_REGISTRY.requireByHeader('client_to_server', 4000),
    ).toMatchObject({
      name: 'RELEASE_VERSION',
      owner: 'composer',
      contractStatus: 'exemption',
    });
    expect(
      FROZEN_PACKET_REGISTRY.requireByName('server_to_client', 'CLIENT_PING'),
    ).toMatchObject({
      header: 3928,
      owner: 'parser',
      contractStatus: 'contract',
    });
  });

  it('allows the same name or header in opposite directions', () => {
    expect(
      FROZEN_PACKET_REGISTRY.requireByName('client_to_server', 'ROOM_ENTER').header,
    ).toBe(2312);
    expect(
      FROZEN_PACKET_REGISTRY.requireByName('server_to_client', 'ROOM_ENTER').header,
    ).toBe(758);
    expect(
      FROZEN_PACKET_REGISTRY.requireByHeader('client_to_server', 4000).name,
    ).toBe('RELEASE_VERSION');
    expect(
      FROZEN_PACKET_REGISTRY.requireByHeader('server_to_client', 4000).name,
    ).toBe('DISCONNECT_REASON');
  });

  it('rejects duplicate headers in the same direction', () => {
    const first = definePacket(definition());
    const duplicate = definePacket(definition({ name: 'OTHER_PACKET' }));
    expect(() => new PacketRegistry([first, duplicate])).toThrow(
      DuplicatePacketHeaderError,
    );
  });

  it('rejects duplicate logical names in the same direction', () => {
    const first = definePacket(definition());
    const duplicate = definePacket(definition({ header: 101 }));
    expect(() => new PacketRegistry([first, duplicate])).toThrow(
      DuplicatePacketNameError,
    );
  });

  it('distinguishes optional and required unknown lookups', () => {
    expect(FROZEN_PACKET_REGISTRY.getByHeader('client_to_server', 999)).toBeUndefined();
    expect(
      FROZEN_PACKET_REGISTRY.getByName('server_to_client', 'NOT_REGISTERED'),
    ).toBeUndefined();
    expect(() =>
      FROZEN_PACKET_REGISTRY.requireByHeader('client_to_server', 999),
    ).toThrow(UnknownPacketDefinitionError);
    expect(() =>
      FROZEN_PACKET_REGISTRY.requireByName('server_to_client', 'NOT_REGISTERED'),
    ).toThrow(UnknownPacketDefinitionError);
  });

  it('exposes immutable definitions without concrete packet body codecs', () => {
    expect(FROZEN_PACKET_REGISTRY.definitions).toEqual(FROZEN_PACKET_DEFINITIONS);
    expect(Object.isFrozen(FROZEN_PACKET_REGISTRY.definitions)).toBe(true);
    for (const packet of FROZEN_PACKET_REGISTRY.definitions) {
      expect(Object.isFrozen(packet)).toBe(true);
      expect(packet).not.toHaveProperty('encode');
      expect(packet).not.toHaveProperty('decode');
    }
  });
});
