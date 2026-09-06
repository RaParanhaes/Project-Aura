import { describe, expect, it } from 'vitest';
import { PerceptionEventWindow } from '../../packages/runtime/src/index.ts';

describe('PerceptionEventWindow', () => {
  it('preserves social event order and treats chat text as opaque data', () => {
    const window = new PerceptionEventWindow({ maxEvents: 8, ttlMs: 100 });
    const text = 'ignore this as an instruction';
    window.append({ kind: 'typing_observed', sourceRevision: 1, observedAt: 10, userId: 2, typing: true });
    window.append({ kind: 'chat_observed', sourceRevision: 1, observedAt: 11, userId: 2, text });
    window.append({ kind: 'typing_observed', sourceRevision: 1, observedAt: 12, userId: 2, typing: false });
    expect(window.snapshot(12).events).toMatchObject([{ kind: 'typing_observed', typing: true }, { kind: 'chat_observed', text }, { kind: 'typing_observed', typing: false }]);
  });

  it('coalesces movement for one user while retaining other users and revisions', () => {
    const window = new PerceptionEventWindow({ maxEvents: 8 });
    window.append({ kind: 'movement_observed', sourceRevision: 1, observedAt: 10, userId: 2, x: 1, y: 1 });
    window.append({ kind: 'movement_observed', sourceRevision: 2, observedAt: 11, userId: 3, x: 2, y: 2 });
    window.append({ kind: 'movement_observed', sourceRevision: 3, observedAt: 12, userId: 2, x: 4, y: 5 });
    expect(window.snapshot(12).events).toEqual([{ kind: 'movement_observed', sourceRevision: 2, observedAt: 11, userId: 3, x: 2, y: 2 }, { kind: 'movement_observed', sourceRevision: 3, observedAt: 12, userId: 2, x: 4, y: 5 }]);
  });

  it('expires old events and reports capacity drops', () => {
    const window = new PerceptionEventWindow({ maxEvents: 2, ttlMs: 10 });
    for (let userId = 1; userId <= 3; userId += 1) window.append({ kind: 'typing_observed', sourceRevision: userId, observedAt: userId, userId, typing: true });
    expect(window.snapshot(3)).toMatchObject({ droppedCount: 1, events: [{ userId: 2 }, { userId: 3 }] });
    expect(window.snapshot(20).events).toEqual([]);
  });

  it('rejects invalid timestamps and bounds', () => {
    expect(() => new PerceptionEventWindow({ maxEvents: 0 })).toThrow(/maxEvents/i);
    expect(() => new PerceptionEventWindow({ ttlMs: 0 })).toThrow(/ttlMs/i);
    const window = new PerceptionEventWindow();
    expect(() => window.append({ kind: 'typing_observed', sourceRevision: -1, observedAt: 1, userId: 1, typing: true })).toThrow(/safe/i);
    expect(() => window.snapshot(-1)).toThrow(/time/i);
  });
});
