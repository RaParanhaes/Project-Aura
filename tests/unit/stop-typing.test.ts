import { describe, expect, it, vi } from 'vitest';
import { CapabilityRegistry, registerStopTyping } from '../../packages/runtime/src/index.ts';
const context = { world: { revision: 1, roomId: 1, homeRoom: undefined, lastObservedAt: 1 } };
describe('STOP_TYPING capability', () => {
  it('dispatches the bodyless action', async () => {
    const command = vi.fn(async () => {}); const registry = new CapabilityRegistry(); registerStopTyping(registry, command);
    await expect(registry.request('STOP_TYPING', undefined, context, 'action-stop-typing')).resolves.toEqual({ actionId: 'action-stop-typing', status: 'pending' });
    expect(command).toHaveBeenCalledWith('action-stop-typing', undefined, context);
  });
  it('rejects payloads and missing room observation', async () => {
    const registry = new CapabilityRegistry(); registerStopTyping(registry, async () => {});
    await expect(registry.request('STOP_TYPING', {}, context, 'bad')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('STOP_TYPING', undefined, { world: { ...context.world, roomId: undefined } }, 'no-room')).resolves.toMatchObject({ status: 'rejected', reason: 'room observation required' });
  });
});
