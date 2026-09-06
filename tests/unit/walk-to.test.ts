import { describe, expect, it, vi } from 'vitest';
import { CapabilityRegistry, registerWalkTo } from '../../packages/runtime/src/index.js';

const context = { world: { revision: 1, roomId: 1, homeRoom: undefined, lastObservedAt: 1 } };

describe('WALK_TO capability', () => {
  it('dispatches valid coordinates through the injected command', async () => {
    const command = vi.fn(async () => {});
    const registry = new CapabilityRegistry();
    registerWalkTo(registry, command);
    await expect(registry.request('WALK_TO', { x: 4, y: 7 }, context, 'action-walk')).resolves.toEqual({ actionId: 'action-walk', status: 'pending' });
    expect(command).toHaveBeenCalledWith('action-walk', { x: 4, y: 7 }, context);
  });

  it('rejects invalid coordinates and missing room observation', async () => {
    const registry = new CapabilityRegistry();
    registerWalkTo(registry, async () => {});
    await expect(registry.request('WALK_TO', { x: -1, y: 2 }, context, 'bad')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('WALK_TO', { x: 1, y: 2 }, { world: { ...context.world, roomId: undefined } }, 'no-room')).resolves.toMatchObject({ status: 'rejected', reason: 'room observation required' });
  });
});
