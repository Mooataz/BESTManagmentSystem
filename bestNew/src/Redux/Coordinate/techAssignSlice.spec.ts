import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './techAssignSlice';

describe('techAssignSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { techAssign: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().techAssign;
    expect(state.user).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { techAssign: reducer },
      preloadedState: {
        techAssign: { user: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().techAssign.error).toBeNull();
  });

  it('should handle AssignTech.pending', () => {
    store.dispatch({ type: 'users/userAssign/pending' });
    const state = store.getState().techAssign;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle AssignTech.fulfilled', () => {
    const users = [{ login: 'tech1', name: 'Tech One', role: ['tech'], status: 'active' }];
    store.dispatch({ type: 'users/userAssign/fulfilled', payload: users });
    const state = store.getState().techAssign;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.user).toEqual(users);
  });

  it('should handle AssignTech.rejected', () => {
    store.dispatch({ type: 'users/userAssign/rejected', payload: 'Erreur assignation' });
    const state = store.getState().techAssign;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur assignation');
  });

  it('should handle AssignTech.rejected with default error', () => {
    store.dispatch({ type: 'users/userAssign/rejected' });
    expect(store.getState().techAssign.error).toBe('Erreur inconnue');
  });
});
