import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import demandeClientReducer, { clearError } from './DemandeClientSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('DemandeClientSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { DemandeClient: demandeClientReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().DemandeClient;
    expect(state.demandeClient).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { DemandeClient: demandeClientReducer },
      preloadedState: {
        DemandeClient: { demandeClient: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().DemandeClient.error).toBeNull();
  });

  it('should handle getDemandeClient.pending', () => {
    store.dispatch({ type: 'DemandeClient/getAll/pending' });
    expect(store.getState().DemandeClient.loading).toBe(true);
  });

  it('should handle getDemandeClient.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Demande A' }];
    store.dispatch({ type: 'DemandeClient/getAll/fulfilled', payload });
    const state = store.getState().DemandeClient;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.demandeClient).toEqual(payload);
  });

  it('should handle getDemandeClient.rejected', () => {
    store.dispatch({ type: 'DemandeClient/getAll/rejected' });
    expect(store.getState().DemandeClient.error).toBe('Erreur inconnue');
  });

  it('should handle AddDemandeClient.pending', () => {
    store.dispatch({ type: 'DemandeClient/add/pending' });
    expect(store.getState().DemandeClient.loading).toBe(true);
  });

  it('should handle AddDemandeClient.fulfilled', () => {
    const payload: TypeUnique = { id: 2, name: 'Nouvelle demande' };
    store.dispatch({ type: 'DemandeClient/add/fulfilled', payload });
    const state = store.getState().DemandeClient;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.demandeClient).toContainEqual(payload);
  });

  it('should handle AddDemandeClient.rejected', () => {
    store.dispatch({ type: 'DemandeClient/add/rejected', payload: 'Erreur' });
    expect(store.getState().DemandeClient.error).toBe('Erreur');
  });

  it('should handle UpdateOneDemandeClient.pending', () => {
    store.dispatch({ type: 'DemandeClient/Update/pending' });
    expect(store.getState().DemandeClient.loading).toBe(true);
  });

  it('should handle UpdateOneDemandeClient.fulfilled', () => {
    const payload: TypeUnique = { id: 1, name: 'Mis à jour' };
    store.dispatch({ type: 'DemandeClient/Update/fulfilled', payload });
    expect(store.getState().DemandeClient.demandeClient).toContainEqual(payload);
  });

  it('should handle UpdateOneDemandeClient.rejected', () => {
    store.dispatch({ type: 'DemandeClient/Update/rejected' });
    expect(store.getState().DemandeClient.error).toBe('Erreur inconnue');
  });
});
