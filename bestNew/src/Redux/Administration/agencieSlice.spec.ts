import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import agencieReducer, { clearError } from './agencieSlice';
import type { Agency } from '../Types/Stock';

describe('agencieSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { agencies: agencieReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().agencies;
    expect(state.Agency).toEqual([]);
    expect(state.currentallAgency).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { agencies: agencieReducer },
      preloadedState: {
        agencies: { Agency: [], currentallAgency: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().agencies.error).toBeNull();
  });

  it('should handle getAgencies.pending', () => {
    store.dispatch({ type: 'branches/getAll/pending' });
    const state = store.getState().agencies;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle getAgencies.fulfilled', () => {
    const payload: Agency[] = [
      { id: 1, name: 'Agence Centrale', phone: 123456789, email: 'central@test.com', location: 'Centre-ville' },
    ];
    store.dispatch({ type: 'branches/getAll/fulfilled', payload });
    const state = store.getState().agencies;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.Agency).toEqual(payload);
  });

  it('should handle getAgencies.rejected', () => {
    store.dispatch({ type: 'branches/getAll/rejected' });
    const state = store.getState().agencies;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur inconnue');
  });

  it('should handle getAgencies.rejected with payload', () => {
    store.dispatch({ type: 'branches/getAll/rejected', payload: 'Erreur réseau' });
    expect(store.getState().agencies.error).toBe('Erreur réseau');
  });

  it('should handle addAgencies.pending', () => {
    store.dispatch({ type: 'agencies/add/pending' });
    const state = store.getState().agencies;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle addAgencies.fulfilled', () => {
    const payload: Agency = { id: 2, name: 'Nouvelle Agence', phone: 987654321, email: 'new@test.com', location: 'Banlieue' };
    store.dispatch({ type: 'agencies/add/fulfilled', payload });
    const state = store.getState().agencies;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.Agency).toContainEqual(payload);
  });

  it('should handle addAgencies.rejected', () => {
    store.dispatch({ type: 'agencies/add/rejected' });
    const state = store.getState().agencies;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur inconnue');
  });
});
