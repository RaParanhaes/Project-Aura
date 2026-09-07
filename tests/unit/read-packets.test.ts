import { describe, expect, it } from 'vitest';
import { CatalogPageRequestComposer, InventoryBadgesRequestComposer, InventoryItemsRequestComposer, UserProfileRequestComposer } from '../../packages/protocol/src/index.ts';

const hex = (bytes: Uint8Array) => [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');

describe('Polaris read packet composers', () => {
  it('matches the frozen request bodies', () => {
    expect(hex(new UserProfileRequestComposer(42).encode())).toBe('000000070cc10000002a01');
    expect(hex(new InventoryItemsRequestComposer().encode())).toBe('000000020c4e');
    expect(hex(new InventoryBadgesRequestComposer().encode())).toBe('000000020ad1');
    expect(hex(new CatalogPageRequestComposer(5).encode())).toBe('00000012019c000000050000000000066e6f726d616c');
  });
});
