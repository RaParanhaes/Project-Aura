import { describe, expect, it } from 'vitest';
import {
  detectCycles,
  parseAuraSpecifier,
  validateInternalEdge
} from '../../scripts/architecture-rules.mjs';

describe('AURA architecture guardrails', () => {
  it('accepts currently approved workspace dependency directions', () => {
    expect(validateInternalEdge('@aura/runtime', '@aura/domain')).toBeNull();
    expect(validateInternalEdge('@aura/polaris', '@aura/protocol')).toBeNull();
    expect(validateInternalEdge('@aura/persistence', '@aura/domain')).toBeNull();
  });

  it('rejects forbidden dependency directions', () => {
    expect(validateInternalEdge('@aura/domain', '@aura/polaris')).toBe(
      '@aura/domain must not depend on @aura/polaris'
    );
    expect(validateInternalEdge('@aura/protocol', '@aura/runtime')).toBe(
      '@aura/protocol must not depend on @aura/runtime'
    );
  });

  it('identifies deep imports into another AURA workspace', () => {
    expect(parseAuraSpecifier('@aura/domain/src/private.ts')).toEqual({
      packageName: '@aura/domain',
      deepImport: true
    });
    expect(parseAuraSpecifier('@aura/domain')).toEqual({
      packageName: '@aura/domain',
      deepImport: false
    });
  });

  it('detects cycles in a workspace graph', () => {
    const graph = new Map([
      ['@aura/runtime', new Set(['@aura/domain'])],
      ['@aura/domain', new Set(['@aura/runtime'])]
    ]);

    expect(detectCycles(graph)).toEqual([
      ['@aura/runtime', '@aura/domain', '@aura/runtime']
    ]);
  });
});
