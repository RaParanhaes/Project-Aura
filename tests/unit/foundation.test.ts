import { describe, expect, it } from 'vitest';

describe('AURA F1.2 test baseline', () => {
  it('loads the TypeScript application entrypoint through the test runner', async () => {
    const auraCore = await import('../../apps/aura-core/src/main.ts');

    expect(auraCore).toBeDefined();
  });
});
