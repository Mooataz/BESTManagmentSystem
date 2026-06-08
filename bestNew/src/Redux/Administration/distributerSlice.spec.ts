import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import distributerReducer, { clearError } from './distributerSlice';
import type { Distributor } from '../Types/repairTypes';

describe('distributerSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { distributer: distributerReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().distributer;
    expect(state.distributer).toEqual([]);
    expect(state.oneDistributer).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { distributer: distributerReducer },
      preloadedState: {
        distributer: { distributer: [], oneDistributer: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().distributer.error).toBeNull();
  });

  it('should handle getDistributers.pending', () => {
    store.dispatch({ type: 'distributer/getAll/pending' });
    expect(store.getState().distributer.loading).toBe(true);
  });

  it('should handle getDistributers.fulfilled', () => {
    const payload: Distributor[] = [{ id: 1, name: 'Dist A', phone: 123, email: 'a@b.com', location: 'Loc', taxRegisterNumber: 'T123' }];
    store.dispatch({ type: 'distributer/getAll/fulfilled', payload });
    expect(store.getState().distributer.distributer).toEqual(payload);
  });

  it('should handle getDistributers.rejected', () => {
    store.dispatch({ type: 'distributer/getAll/rejected' });
    expect(store.getState().distributer.error).toBe('Erreur inconnue');
  });

  it('should handle getOneDistributer.pending', () => {
    store.dispatch({ type: 'distributer/getOne/pending' });
    expect(store.getState().distributer.loading).toBe(true);
  });

  it('should handle getOneDistributer.fulfilled', () => {
    const payload: Distributor = { id: 1, name: 'Dist B', phone: 456, email: 'b@b.com', location: 'Loc2', taxRegisterNumber: 'T456' };
    store.dispatch({ type: 'distributer/getOne/fulfilled', payload });
    const state = store.getState().distributer;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.oneDistributer).toEqual(payload);
  });

  it('should handle getOneDistributer.rejected', () => {
    store.dispatch({ type: 'distributer/getOne/rejected', payload: 'Erreur' });
    expect(store.getState().distributer.error).toBe('Erreur');
  });

  it('should handle UpdateOneDistributer.pending', () => {
    store.dispatch({ type: 'distributer/UpdateOne/pending' });
    expect(store.getState().distributer.loading).toBe(true);
  });

  it('should handle UpdateOneDistributer.fulfilled', () => {
    const payload: Distributor = { id: 1, name: 'Dist Updated', phone: 789, email: 'up@b.com', location: 'NewLoc', taxRegisterNumber: 'T789' };
    store.dispatch({ type: 'distributer/UpdateOne/fulfilled', payload });
    expect(store.getState().distributer.distributer).toContainEqual(payload);
  });

  it('should handle UpdateOneDistributer.rejected', () => {
    store.dispatch({ type: 'distributer/UpdateOne/rejected' });
    expect(store.getState().distributer.error).toBe('Erreur inconnue');
  });

  it('should handle AddOneDistributer.pending', () => {
    store.dispatch({ type: 'distributer/AddOne/pending' });
    expect(store.getState().distributer.loading).toBe(true);
  });

  it('should handle AddOneDistributer.fulfilled', () => {
    const payload: Distributor = { id: 2, name: 'Dist New', phone: 111, email: 'new@b.com', location: 'New', taxRegisterNumber: 'T111' };
    store.dispatch({ type: 'distributer/AddOne/fulfilled', payload });
    expect(store.getState().distributer.distributer).toContainEqual(payload);
  });

  it('should handle AddOneDistributer.rejected', () => {
    store.dispatch({ type: 'distributer/AddOne/rejected' });
    expect(store.getState().distributer.error).toBe('Erreur inconnue');
  });
});
