import { describe, it, expect } from 'vitest';
import { store } from './Redux/store';

describe('Store', () => {
  it('should be configured with correct slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('company');
  });
});
