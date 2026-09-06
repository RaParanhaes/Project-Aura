import { describe, expect, it } from 'vitest';
import { CapabilityRegistry, registerWhisper } from '../../packages/runtime/src/index.ts';

describe('WHISPER capability', () => {
  const context = { world: { roomId: 1 } };

  it('accepts a recipient and room speech', async () => {
    const registry = new CapabilityRegistry();
    const calls: unknown[] = [];
    registerWhisper(registry, async (...args) => { calls.push(args); });
    await expect(registry.request('WHISPER', { recipient: 'Cabana', text: 'oi' }, context, 'whisper-1')).resolves.toEqual({ actionId: 'whisper-1', status: 'pending' });
    expect(calls).toHaveLength(1);
  });

  it('rejects invalid recipients, empty text and missing room', async () => {
    const registry = new CapabilityRegistry();
    registerWhisper(registry, async () => undefined);
    await expect(registry.request('WHISPER', { recipient: 'Cabana Silva', text: 'oi' }, context, 'bad-recipient')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('WHISPER', { recipient: 'Cabana', text: '' }, context, 'bad-text')).resolves.toMatchObject({ status: 'rejected' });
    await expect(registry.request('WHISPER', { recipient: 'Cabana', text: 'oi' }, { world: {} }, 'no-room')).resolves.toMatchObject({ status: 'rejected', reason: 'room observation required' });
  });
});
