import { describe, expect, it, vi } from 'vitest';
import { CapabilityRegistry, registerLookAt } from '../../packages/runtime/src/index.js';

const context = { world: { revision: 1, roomId: 1, homeRoom: undefined, lastObservedAt: 1 } };

describe('LOOK_AT capability', () => {
  it('dispatches valid coordinates through the injected command', async () => {
    const command = vi.fn(async () => {});
    const registry = new CapabilityRegistry();
    registerLookAt(registry, command);
    await expect(registry.request('LOOK_AT', { x: 4, y: 7 }, context, 'action-look')).resolves.toEqual({ actionId: 'action-look', status: 'pending' });
    expect(command).toHaveBeenCalledWith('action-look', { x: 4, y: 7 }, context);
  });

  it('rejects invalid coordinates and missing room observation', async () => {
    const registry = new CapabilityRegistry();
    registerLookAt(registry, async () => {});
    await expect(registry.request('LOOK_AT', { x: -1, y: 2 }, context, 'bad')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('LOOK_AT', { x: 1, y: 2 }, { world: { ...context.world, roomId: undefined } }, 'no-room')).resolves.toMatchObject({ status: 'rejected', reason: 'room observation required' });
  });
});
