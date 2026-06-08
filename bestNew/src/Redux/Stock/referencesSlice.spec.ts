import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './referencesSlice';

describe('referencesSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { references: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().references;
    expect(state.references).toEqual([]);
    expect(state.oneReference).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { references: reducer },
      preloadedState: {
        references: { references: [], oneReference: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().references.error).toBeNull();
  });

  it('should handle getReferences.pending', () => {
    store.dispatch({ type: 'references/getAll/pending' });
    expect(store.getState().references.loading).toBe(true);
  });

  it('should handle getReferences.fulfilled', () => {
    const refs = [{ id: 1, materialCode: 'MC001', description: 'Desc' }];
    store.dispatch({ type: 'references/getAll/fulfilled', payload: refs });
    const state = store.getState().references;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.references).toEqual(refs);
  });

  it('should handle getReferences.rejected', () => {
    store.dispatch({ type: 'references/getAll/rejected', payload: 'Err' });
    expect(store.getState().references.error).toBe('Err');
  });

  it('should handle AddOneReference.pending', () => {
    store.dispatch({ type: 'References/AddOneReference/pending' });
    expect(store.getState().references.loading).toBe(true);
  });

  it('should handle AddOneReference.fulfilled', () => {
    const refs = [{ id: 2, materialCode: 'MC002' }];
    store.dispatch({ type: 'References/AddOneReference/fulfilled', payload: refs });
    expect(store.getState().references.references).toEqual(refs);
  });

  it('should handle AddOneReference.rejected', () => {
    store.dispatch({ type: 'References/AddOneReference/rejected', payload: 'Fail' });
    expect(store.getState().references.error).toBe('Fail');
  });

  it('should handle getOneReference.pending', () => {
    store.dispatch({ type: 'references/getOne/pending' });
    expect(store.getState().references.loading).toBe(true);
  });

  it('should handle getOneReference.fulfilled', () => {
    const ref = { id: 3, materialCode: 'MC003' };
    store.dispatch({ type: 'references/getOne/fulfilled', payload: ref });
    expect(store.getState().references.oneReference).toEqual(ref);
  });

  it('should handle getOneReference.rejected', () => {
    store.dispatch({ type: 'references/getOne/rejected', payload: 'Not found' });
    expect(store.getState().references.error).toBe('Not found');
  });

  it('should handle getByMaterialCode.pending', () => {
    store.dispatch({ type: 'references/getByMaterialCode/pending' });
    expect(store.getState().references.loading).toBe(true);
  });

  it('should handle getByMaterialCode.fulfilled', () => {
    const ref = { id: 4, materialCode: 'MC004' };
    store.dispatch({ type: 'references/getByMaterialCode/fulfilled', payload: ref });
    expect(store.getState().references.oneReference).toEqual(ref);
  });

  it('should handle getByMaterialCode.rejected', () => {
    store.dispatch({ type: 'references/getByMaterialCode/rejected', payload: 'Err' });
    expect(store.getState().references.error).toBe('Err');
  });

  it('should handle UpdateOneReference.pending', () => {
    store.dispatch({ type: 'references/updateOne/pending' });
    expect(store.getState().references.loading).toBe(true);
  });

  it('should handle UpdateOneReference.fulfilled', () => {
    const ref = { id: 5, materialCode: 'MC005' };
    store.dispatch({ type: 'references/updateOne/fulfilled', payload: ref });
    expect(store.getState().references.oneReference).toEqual(ref);
  });

  it('should handle UpdateOneReference.rejected', () => {
    store.dispatch({ type: 'references/updateOne/rejected', payload: 'Oops' });
    expect(store.getState().references.error).toBe('Oops');
  });

  it('should handle rejected with default error', () => {
    store.dispatch({ type: 'references/updateOne/rejected' });
    expect(store.getState().references.error).toBe('Erreur inconnue');
  });
});
