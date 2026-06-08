import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import expertiseReasonReducer, { clearError } from './ExpertiseReasonSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('ExpertiseReasonSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { expertiseReasons: expertiseReasonReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().expertiseReasons;
    expect(state.ExpertiseRaisons).toEqual([]);
    expect(state.OneRaison).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { expertiseReasons: expertiseReasonReducer },
      preloadedState: {
        expertiseReasons: { ExpertiseRaisons: [], OneRaison: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().expertiseReasons.error).toBeNull();
  });

  it('should handle getAllExpertiseRaisons.pending', () => {
    store.dispatch({ type: 'expertiseReasons/GetAll/pending' });
    expect(store.getState().expertiseReasons.loading).toBe(true);
  });

  it('should handle getAllExpertiseRaisons.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Raison A' }];
    store.dispatch({ type: 'expertiseReasons/GetAll/fulfilled', payload });
    const state = store.getState().expertiseReasons;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.ExpertiseRaisons).toEqual(payload);
  });

  it('should handle getAllExpertiseRaisons.rejected', () => {
    store.dispatch({ type: 'expertiseReasons/GetAll/rejected' });
    expect(store.getState().expertiseReasons.error).toBe('Erreur inconnue');
  });

  it('should handle AddOneRaisons.pending', () => {
    store.dispatch({ type: 'expertiseReasons/Add/pending' });
    expect(store.getState().expertiseReasons.loading).toBe(true);
  });

  it('should handle AddOneRaisons.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 2, name: 'Nouvelle raison' }];
    store.dispatch({ type: 'expertiseReasons/Add/fulfilled', payload });
    expect(store.getState().expertiseReasons.ExpertiseRaisons).toEqual(payload);
  });

  it('should handle AddOneRaisons.rejected', () => {
    store.dispatch({ type: 'expertiseReasons/Add/rejected', payload: 'Erreur' });
    expect(store.getState().expertiseReasons.error).toBe('Erreur');
  });

  it('should handle UpdateOneRaison.pending', () => {
    store.dispatch({ type: 'expertiseReasons/Update/pending' });
    expect(store.getState().expertiseReasons.loading).toBe(true);
  });

  it('should handle UpdateOneRaison.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Mis à jour' }];
    store.dispatch({ type: 'expertiseReasons/Update/fulfilled', payload });
    expect(store.getState().expertiseReasons.ExpertiseRaisons).toEqual(payload);
  });

  it('should handle UpdateOneRaison.rejected', () => {
    store.dispatch({ type: 'expertiseReasons/Update/rejected' });
    expect(store.getState().expertiseReasons.error).toBe('Erreur inconnue');
  });

  it('should handle GetOneRaison.pending', () => {
    store.dispatch({ type: 'expertiseReasons/GetOneRaison/pending' });
    expect(store.getState().expertiseReasons.loading).toBe(true);
  });

  it('should handle GetOneRaison.fulfilled', () => {
    const payload: TypeUnique = { id: 3, name: 'Raison unique' };
    store.dispatch({ type: 'expertiseReasons/GetOneRaison/fulfilled', payload });
    const state = store.getState().expertiseReasons;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.OneRaison).toEqual(payload);
  });

  it('should handle GetOneRaison.rejected', () => {
    store.dispatch({ type: 'expertiseReasons/GetOneRaison/rejected', payload: 'Introuvable' });
    expect(store.getState().expertiseReasons.error).toBe('Introuvable');
  });
});
