import { describe, expect, it, vi } from 'vitest';
import { CapabilityRegistry, registerStartTyping } from '../../packages/runtime/src/index.js';

const context = { world: { revision: 1, roomId: 1, homeRoom: undefined, lastObservedAt: 1 } };

describe('START_TYPING capability', () => {
  it('dispatches the bodyless action through the injected command', async () => {
    const command = vi.fn(async () => {});
    const registry = new CapabilityRegistry();
    registerStartTyping(registry, command);
    await expect(registry.request('START_TYPING', undefined, context, 'action-typing')).resolves.toEqual({ actionId: 'action-typing', status: 'pending' });
    expect(command).toHaveBeenCalledWith('action-typing', undefined, context);
  });

  it('rejects payloads and missing room observation', async () => {
    const registry = new CapabilityRegistry();
    registerStartTyping(registry, async () => {});
    await expect(registry.request('START_TYPING', {}, context, 'bad')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('START_TYPING', undefined, { world: { ...context.world, roomId: undefined } }, 'no-room')).resolves.toMatchObject({ status: 'rejected', reason: 'room observation required' });
  });
});
