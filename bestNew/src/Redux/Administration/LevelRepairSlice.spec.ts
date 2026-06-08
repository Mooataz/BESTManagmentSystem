import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import levelRepairReducer, { clearError } from './LevelRepairSlice';
import type { LevelRepairForm } from '../Types/administrationTypes';

describe('LevelRepairSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { LevelRepair: levelRepairReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().LevelRepair;
    expect(state.levelRepair).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { LevelRepair: levelRepairReducer },
      preloadedState: {
        LevelRepair: { levelRepair: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().LevelRepair.error).toBeNull();
  });

  it('should handle getLevelRepair.pending', () => {
    store.dispatch({ type: 'LevelRepair/getAll/pending' });
    expect(store.getState().LevelRepair.loading).toBe(true);
  });

  it('should handle getLevelRepair.fulfilled', () => {
    const payload: LevelRepairForm[] = [{ id: 1, name: 'Niveau 1', price: 100 }];
    store.dispatch({ type: 'LevelRepair/getAll/fulfilled', payload });
    const state = store.getState().LevelRepair;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.levelRepair).toEqual(payload);
  });

  it('should handle getLevelRepair.rejected', () => {
    store.dispatch({ type: 'LevelRepair/getAll/rejected' });
    expect(store.getState().LevelRepair.error).toBe('Erreur inconnue');
  });

  it('should handle AddLevelRepair.pending', () => {
    store.dispatch({ type: 'LevelRepair/AddOne/pending' });
    expect(store.getState().LevelRepair.loading).toBe(true);
  });

  it('should handle AddLevelRepair.fulfilled', () => {
    const payload: LevelRepairForm = { id: 2, name: 'Niveau 2', price: 200 };
    store.dispatch({ type: 'LevelRepair/AddOne/fulfilled', payload });
    const state = store.getState().LevelRepair;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.levelRepair).toContainEqual(payload);
  });

  it('should handle AddLevelRepair.rejected', () => {
    store.dispatch({ type: 'LevelRepair/AddOne/rejected', payload: 'Erreur' });
    expect(store.getState().LevelRepair.error).toBe('Erreur');
  });

  it('should handle UpdateOnelevelRepair.pending', () => {
    store.dispatch({ type: 'LevelRepair/UpdateOne/pending' });
    expect(store.getState().LevelRepair.loading).toBe(true);
  });

  it('should handle UpdateOnelevelRepair.fulfilled', () => {
    const payload: LevelRepairForm = { id: 1, name: 'Mis à jour', price: 150 };
    store.dispatch({ type: 'LevelRepair/UpdateOne/fulfilled', payload });
    expect(store.getState().LevelRepair.levelRepair).toContainEqual(payload);
  });

  it('should handle UpdateOnelevelRepair.rejected', () => {
    store.dispatch({ type: 'LevelRepair/UpdateOne/rejected' });
    expect(store.getState().LevelRepair.error).toBe('Erreur inconnue');
  });
});
