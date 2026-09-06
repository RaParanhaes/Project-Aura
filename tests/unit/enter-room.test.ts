import { describe, expect, it, vi } from 'vitest';
import { CapabilityRegistry, registerEnterRoom } from '../../packages/runtime/src/index.ts';

const context = { world: { revision: 1, roomId: 1, homeRoom: undefined, lastObservedAt: 1 } };

describe('ENTER_ROOM capability', () => {
  it('maps a valid semantic request to an injected command and stays pending', async () => {
    const command = vi.fn(async () => {});
    const registry = new CapabilityRegistry();
    registerEnterRoom(registry, command);
    await expect(registry.request('ENTER_ROOM', { roomId: 2 }, context, 'action-room')).resolves.toEqual({ actionId: 'action-room', status: 'pending' });
    expect(command).toHaveBeenCalledOnce();
  });

  it('rejects invalid input and entering the current room', async () => {
    const registry = new CapabilityRegistry();
    registerEnterRoom(registry, async () => {});
    await expect(registry.request('ENTER_ROOM', { roomId: -1 }, context, 'bad')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('ENTER_ROOM', { roomId: 1 }, context, 'same')).resolves.toMatchObject({ status: 'rejected', reason: 'already in requested room' });
  });
});
