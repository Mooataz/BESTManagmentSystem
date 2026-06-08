import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import legislationReducer, { clearError } from './LegislationSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('LegislationSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { legislation: legislationReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().legislation;
    expect(state.legislation).toEqual([]);
    expect(state.currentlegislation).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { legislation: legislationReducer },
      preloadedState: {
        legislation: { legislation: [], currentlegislation: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().legislation.error).toBeNull();
  });

  it('should handle addLegislation.pending', () => {
    store.dispatch({ type: 'legislation/add/pending' });
    expect(store.getState().legislation.loading).toBe(true);
  });

  it('should handle addLegislation.fulfilled', () => {
    const payload: TypeUnique = { id: 1, name: 'Loi A' };
    store.dispatch({ type: 'legislation/add/fulfilled', payload });
    const state = store.getState().legislation;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.currentlegislation).toEqual(payload);
    expect(state.legislation).toContainEqual(payload);
  });

  it('should handle addLegislation.rejected', () => {
    store.dispatch({ type: 'legislation/add/rejected' });
    expect(store.getState().legislation.error).toBe('Erreur inconnue');
  });

  it('should handle getLegislations.pending', () => {
    store.dispatch({ type: 'legislation/getAll/pending' });
    expect(store.getState().legislation.loading).toBe(true);
  });

  it('should handle getLegislations.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Loi A' }, { id: 2, name: 'Loi B' }];
    store.dispatch({ type: 'legislation/getAll/fulfilled', payload });
    expect(store.getState().legislation.legislation).toEqual(payload);
  });

  it('should handle getLegislations.rejected', () => {
    store.dispatch({ type: 'legislation/getAll/rejected', payload: 'Erreur' });
    expect(store.getState().legislation.error).toBe('Erreur');
  });

  it('should handle UpdateLegislations.pending', () => {
    store.dispatch({ type: 'legislation/Update/pending' });
    expect(store.getState().legislation.loading).toBe(true);
  });

  it('should handle UpdateLegislations.fulfilled', () => {
    const payload: TypeUnique = { id: 1, name: 'Mis à jour' };
    store.dispatch({ type: 'legislation/Update/fulfilled', payload });
    expect(store.getState().legislation.legislation).toContainEqual(payload);
  });

  it('should handle UpdateLegislations.rejected', () => {
    store.dispatch({ type: 'legislation/Update/rejected' });
    expect(store.getState().legislation.error).toBe('Erreur inconnue');
  });
});
