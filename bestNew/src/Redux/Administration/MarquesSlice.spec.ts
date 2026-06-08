import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import marquesReducer, { clearError } from './MarquesSlice';
import type { Marque } from '../Types/repairTypes';

describe('MarquesSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { brands: marquesReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().brands;
    expect(state.Marque).toEqual([]);
    expect(state.currentallMarque).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { brands: marquesReducer },
      preloadedState: {
        brands: { Marque: [], currentallMarque: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().brands.error).toBeNull();
  });

  it('should handle getMarques.pending', () => {
    store.dispatch({ type: 'brands/getAllAutoriser/pending' });
    expect(store.getState().brands.loading).toBe(true);
  });

  it('should handle getMarques.fulfilled', () => {
    const payload: Marque[] = [{ id: 1, name: 'Marque A', status: 'active' }];
    store.dispatch({ type: 'brands/getAllAutoriser/fulfilled', payload });
    const state = store.getState().brands;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.Marque).toEqual(payload);
  });

  it('should handle getMarques.rejected', () => {
    store.dispatch({ type: 'brands/getAllAutoriser/rejected' });
    expect(store.getState().brands.error).toBe('Erreur inconnue');
  });

  it('should handle getAllMarques.pending', () => {
    store.dispatch({ type: 'brands/getAll/pending' });
    expect(store.getState().brands.loading).toBe(true);
  });

  it('should handle getAllMarques.fulfilled', () => {
    const payload: Marque[] = [{ id: 2, name: 'Marque B', status: 'inactive' }];
    store.dispatch({ type: 'brands/getAll/fulfilled', payload });
    expect(store.getState().brands.Marque).toEqual(payload);
  });

  it('should handle getAllMarques.rejected', () => {
    store.dispatch({ type: 'brands/getAll/rejected', payload: 'Erreur' });
    expect(store.getState().brands.error).toBe('Erreur');
  });

  it('should handle AddOneMarque.pending', () => {
    store.dispatch({ type: 'brands/Add/pending' });
    expect(store.getState().brands.loading).toBe(true);
  });

  it('should handle AddOneMarque.fulfilled', () => {
    const payload: Marque[] = [{ id: 3, name: 'Marque Nouvelle', status: 'active' }];
    store.dispatch({ type: 'brands/Add/fulfilled', payload });
    expect(store.getState().brands.Marque).toEqual(payload);
  });

  it('should handle AddOneMarque.rejected', () => {
    store.dispatch({ type: 'brands/Add/rejected' });
    expect(store.getState().brands.error).toBe('Erreur inconnue');
  });

  it('should handle UpdateOneMarque.pending', () => {
    store.dispatch({ type: 'brands/Update/pending' });
    expect(store.getState().brands.loading).toBe(true);
  });

  it('should handle UpdateOneMarque.fulfilled', () => {
    const payload: Marque[] = [{ id: 1, name: 'Marque Updated', status: 'active' }];
    store.dispatch({ type: 'brands/Update/fulfilled', payload });
    expect(store.getState().brands.Marque).toEqual(payload);
  });

  it('should handle UpdateOneMarque.rejected', () => {
    store.dispatch({ type: 'brands/Update/rejected' });
    expect(store.getState().brands.error).toBe('Erreur inconnue');
  });
});
