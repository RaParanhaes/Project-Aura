import { describe, expect, it, vi } from 'vitest';
import { CapabilityRegistry } from '../../packages/runtime/src/index.ts';

const context = { world: { revision: 1, roomId: 1, homeRoom: undefined, lastObservedAt: 1 } };

describe('CapabilityRegistry', () => {
  it('validates semantic requests and reports execution as pending', async () => {
    const execute = vi.fn(async () => {});
    const registry = new CapabilityRegistry();
    registry.register({ name: 'SAY', validate: (value): value is { text: string } => typeof value === 'object' && value !== null && typeof (value as { text?: unknown }).text === 'string', execute });
    await expect(registry.request('SAY', { text: 'hello' }, context, 'action-1')).resolves.toEqual({ actionId: 'action-1', status: 'pending' });
    expect(execute).toHaveBeenCalledOnce();
    await expect(registry.request('SAY', { text: 4 }, context, 'action-2')).resolves.toMatchObject({ status: 'rejected' });
  });

  it('rejects preconditions and unknown capabilities', async () => {
    const registry = new CapabilityRegistry();
    registry.register({ name: 'ENTER_ROOM', validate: (value): value is number => typeof value === 'number', precondition: () => 'room hydration required', execute: async () => {} });
    await expect(registry.request('ENTER_ROOM', 2, context, 'action-3')).resolves.toMatchObject({ status: 'rejected', reason: 'room hydration required' });
    await expect(registry.request('WALK_TO', {}, context, 'action-4')).resolves.toMatchObject({ status: 'rejected' });
  });

  it('enforces cooldown and window limits before sending a command', async () => {
    let now = 1000; const execute = vi.fn(async () => {});
    const registry = new CapabilityRegistry({ now: () => now, rateLimits: { WAVE: { cooldownMs: 100, maxPerWindow: 2, windowMs: 1000 } } });
    registry.register({ name: 'WAVE', validate: (value): value is object => typeof value === 'object' && value !== null, execute });
    await expect(registry.request('WAVE', {}, context, 'a')).resolves.toMatchObject({ status: 'pending' });
    await expect(registry.request('WAVE', {}, context, 'b')).resolves.toMatchObject({ status: 'rejected' });
    now += 100; await expect(registry.request('WAVE', {}, context, 'c')).resolves.toMatchObject({ status: 'pending' });
    now += 100; await expect(registry.request('WAVE', {}, context, 'd')).resolves.toMatchObject({ status: 'rejected', reason: expect.stringContaining('rate limit') });
    expect(execute).toHaveBeenCalledTimes(2);
  });
});
