import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import actionRepairReducer, { clearError } from './ActionRepairSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('ActionRepairSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { RepairAction: actionRepairReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().RepairAction;
    expect(state.repairAction).toEqual([]);
    expect(state.currentRepairAction).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { RepairAction: actionRepairReducer },
      preloadedState: {
        RepairAction: { repairAction: [], currentRepairAction: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().RepairAction.error).toBeNull();
  });

  it('should handle getRepairAction.pending', () => {
    store.dispatch({ type: 'RepairAction/getAll/pending' });
    const state = store.getState().RepairAction;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle getRepairAction.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Réparation standard' }];
    store.dispatch({ type: 'RepairAction/getAll/fulfilled', payload });
    const state = store.getState().RepairAction;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.repairAction).toEqual(payload);
  });

  it('should handle getRepairAction.rejected', () => {
    store.dispatch({ type: 'RepairAction/getAll/rejected', payload: 'Erreur' });
    const state = store.getState().RepairAction;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur');
  });

  it('should handle getRepairAction.rejected with default error', () => {
    store.dispatch({ type: 'RepairAction/getAll/rejected' });
    expect(store.getState().RepairAction.error).toBe('Erreur inconnue');
  });

  it('should handle AddRepairAction.pending', () => {
    store.dispatch({ type: 'RepairAction/AddRepairAction/pending' });
    expect(store.getState().RepairAction.loading).toBe(true);
  });

  it('should handle AddRepairAction.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 2, name: 'Nouvelle action' }];
    store.dispatch({ type: 'RepairAction/AddRepairAction/fulfilled', payload });
    expect(store.getState().RepairAction.repairAction).toEqual(payload);
    expect(store.getState().RepairAction.success).toBe(true);
  });

  it('should handle AddRepairAction.rejected', () => {
    store.dispatch({ type: 'RepairAction/AddRepairAction/rejected' });
    expect(store.getState().RepairAction.error).toBe('Erreur inconnue');
  });

  it('should handle UpdateOneRepairAction.pending', () => {
    store.dispatch({ type: 'RepairAction/UpdateOneRepairAction/pending' });
    expect(store.getState().RepairAction.loading).toBe(true);
  });

  it('should handle UpdateOneRepairAction.fulfilled', () => {
    const payload: TypeUnique = { id: 1, name: 'Mis à jour' };
    store.dispatch({ type: 'RepairAction/UpdateOneRepairAction/fulfilled', payload });
    const state = store.getState().RepairAction;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.repairAction).toContainEqual(payload);
  });

  it('should handle UpdateOneRepairAction.rejected', () => {
    store.dispatch({ type: 'RepairAction/UpdateOneRepairAction/rejected', payload: 'Échec' });
    expect(store.getState().RepairAction.error).toBe('Échec');
  });
});
