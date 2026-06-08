import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import listFaultReducer, { clearError } from './ListFaultSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('ListFaultSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { listfault: listFaultReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().listfault;
    expect(state.listFault).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { listfault: listFaultReducer },
      preloadedState: {
        listfault: { listFault: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().listfault.error).toBeNull();
  });

  it('should handle getListFault.pending', () => {
    store.dispatch({ type: 'listfault/getAll/pending' });
    expect(store.getState().listfault.loading).toBe(true);
  });

  it('should handle getListFault.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Panne A' }];
    store.dispatch({ type: 'listfault/getAll/fulfilled', payload });
    const state = store.getState().listfault;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.listFault).toEqual(payload);
  });

  it('should handle getListFault.rejected', () => {
    store.dispatch({ type: 'listfault/getAll/rejected' });
    expect(store.getState().listfault.error).toBe('Erreur inconnue');
  });

  it('should handle AddListFault.pending', () => {
    store.dispatch({ type: 'listfault/Add/pending' });
    expect(store.getState().listfault.loading).toBe(true);
  });

  it('should handle AddListFault.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 2, name: 'Nouvelle panne' }];
    store.dispatch({ type: 'listfault/Add/fulfilled', payload });
    expect(store.getState().listfault.listFault).toEqual(payload);
  });

  it('should handle AddListFault.rejected', () => {
    store.dispatch({ type: 'listfault/Add/rejected', payload: 'Erreur' });
    expect(store.getState().listfault.error).toBe('Erreur');
  });

  it('should handle UpdateListFault.pending', () => {
    store.dispatch({ type: 'listfault/update/pending' });
    expect(store.getState().listfault.loading).toBe(true);
  });

  it('should handle UpdateListFault.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Mis à jour' }];
    store.dispatch({ type: 'listfault/update/fulfilled', payload });
    expect(store.getState().listfault.listFault).toEqual(payload);
  });

  it('should handle UpdateListFault.rejected', () => {
    store.dispatch({ type: 'listfault/update/rejected' });
    expect(store.getState().listfault.error).toBe('Erreur inconnue');
  });
});
