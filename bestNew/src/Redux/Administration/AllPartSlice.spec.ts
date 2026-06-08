import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import allPartReducer, { clearError } from './AllPartSlice';
import type { FormAllParts } from '../Types/administrationTypes';

describe('AllPartSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { allParts: allPartReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().allParts;
    expect(state.allParts).toEqual([]);
    expect(state.onePart).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { allParts: allPartReducer },
      preloadedState: {
        allParts: { allParts: [], onePart: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().allParts.error).toBeNull();
  });

  it('should handle getAllPart.pending', () => {
    store.dispatch({ type: 'allParts/getAll/pending' });
    expect(store.getState().allParts.loading).toBe(true);
  });

  it('should handle getAllPart.fulfilled', () => {
    const payload: FormAllParts[] = [{ id: 1, description: 'Pièce A' }];
    store.dispatch({ type: 'allParts/getAll/fulfilled', payload });
    const state = store.getState().allParts;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.allParts).toEqual(payload);
  });

  it('should handle getAllPart.rejected', () => {
    store.dispatch({ type: 'allParts/getAll/rejected' });
    expect(store.getState().allParts.error).toBe('Erreur inconnue');
  });

  it('should handle getOnePart.pending', () => {
    store.dispatch({ type: 'allParts/getOne/pending' });
    expect(store.getState().allParts.loading).toBe(true);
  });

  it('should handle getOnePart.fulfilled', () => {
    const payload: FormAllParts = { id: 1, description: 'Pièce unique' };
    store.dispatch({ type: 'allParts/getOne/fulfilled', payload });
    const state = store.getState().allParts;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.onePart).toEqual(payload);
  });

  it('should handle getOnePart.rejected', () => {
    store.dispatch({ type: 'allParts/getOne/rejected', payload: 'Introuvable' });
    expect(store.getState().allParts.error).toBe('Introuvable');
  });

  it('should handle AddOnePart.pending', () => {
    store.dispatch({ type: 'allParts/add/pending' });
    expect(store.getState().allParts.loading).toBe(true);
  });

  it('should handle AddOnePart.fulfilled', () => {
    const payload: FormAllParts = { id: 2, description: 'Nouvelle pièce' };
    store.dispatch({ type: 'allParts/add/fulfilled', payload });
    expect(store.getState().allParts.allParts).toContainEqual(payload);
  });

  it('should handle AddOnePart.rejected', () => {
    store.dispatch({ type: 'allParts/add/rejected' });
    expect(store.getState().allParts.error).toBe('Erreur inconnue');
  });

  it('should handle UpdateOnePart.pending', () => {
    store.dispatch({ type: 'allParts/Update/pending' });
    expect(store.getState().allParts.loading).toBe(true);
  });

  it('should handle UpdateOnePart.fulfilled', () => {
    const payload: FormAllParts = { id: 1, description: 'Mis à jour' };
    store.dispatch({ type: 'allParts/Update/fulfilled', payload });
    expect(store.getState().allParts.allParts).toContainEqual(payload);
  });

  it('should handle UpdateOnePart.rejected', () => {
    store.dispatch({ type: 'allParts/Update/rejected' });
    expect(store.getState().allParts.error).toBe('Erreur inconnue');
  });
});
