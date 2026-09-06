import { describe, expect, it } from 'vitest';
import { SessionRecoveryTokenStore } from '../../packages/runtime/src/index.ts';

describe('SessionRecoveryTokenStore', () => {
  it('keeps only the trimmed in-memory token and can clear it', () => {
    const store = new SessionRecoveryTokenStore();
    expect(store.value).toBe('');
    store.set('  recovery-token  ');
    expect(store.value).toBe('recovery-token');
    store.clear();
    expect(store.value).toBe('');
  });
});
