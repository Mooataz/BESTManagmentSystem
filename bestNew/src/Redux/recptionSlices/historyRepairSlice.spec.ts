import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import historyRepairReducer, { clearError } from './historyRepairSlice';
import type { FormHistoryRepair } from '../Types/repairTypes';

describe('historyRepairSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { historyRepair: historyRepairReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().historyRepair;
    expect(state.insertHistory).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { historyRepair: historyRepairReducer },
      preloadedState: {
        historyRepair: { insertHistory: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().historyRepair.error).toBeNull();
  });

  it('should handle addHistoryRepair.pending', () => {
    store.dispatch({ type: 'historyReppair/pending' });
    const state = store.getState().historyRepair;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle addHistoryRepair.fulfilled', () => {
    const payload: FormHistoryRepair = {
      date: new Date('2024-01-01'),
      step: 'Réception',
      repair: 1,
      user: { id: 1 },
    };
    store.dispatch({ type: 'historyReppair/fulfilled', payload });
    const state = store.getState().historyRepair;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.insertHistory).toHaveLength(1);
    expect(state.insertHistory[0]).toEqual(payload);
  });

  it('should handle addHistoryRepair.rejected', () => {
    store.dispatch({ type: 'historyReppair/rejected', payload: 'Erreur réseau' });
    const state = store.getState().historyRepair;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur réseau');
  });

  it('should handle addHistoryRepair.rejected with default error', () => {
    store.dispatch({ type: 'historyReppair/rejected' });
    expect(store.getState().historyRepair.error).toBe('Erreur inconnue');
  });
});
