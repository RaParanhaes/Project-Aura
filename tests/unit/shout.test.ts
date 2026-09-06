import { describe, expect, it } from 'vitest';
import { CapabilityRegistry, registerShout } from '../../packages/runtime/src/index.ts';

describe('SHOUT capability', () => {
  const context = { world: { roomId: 1 } };

  it('accepts room shout', async () => {
    const registry = new CapabilityRegistry();
    const calls: unknown[] = [];
    registerShout(registry, async (...args) => { calls.push(args); });
    await expect(registry.request('SHOUT', { text: 'oi' }, context, 'shout-1')).resolves.toEqual({ actionId: 'shout-1', status: 'pending' });
    expect(calls).toHaveLength(1);
  });

  it('rejects invalid or roomless shout', async () => {
    const registry = new CapabilityRegistry();
    registerShout(registry, async () => undefined);
    await expect(registry.request('SHOUT', { text: '' }, context, 'bad')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('SHOUT', { text: 'oi' }, { world: {} }, 'no-room')).resolves.toMatchObject({ status: 'rejected', reason: 'room observation required' });
  });
});
