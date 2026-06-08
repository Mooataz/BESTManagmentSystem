import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './TypeModelSlice';

describe('TypeModelSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { TypeModel: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().TypeModel;
    expect(state.typeModel).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { TypeModel: reducer },
      preloadedState: {
        TypeModel: { typeModel: [], loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().TypeModel.error).toBeNull();
  });

  it('should handle GetAllTypeModel.pending', () => {
    store.dispatch({ type: 'TypeModel/GetAll/pending' });
    expect(store.getState().TypeModel.loading).toBe(true);
  });

  it('should handle GetAllTypeModel.fulfilled', () => {
    const types = [{ id: 1, name: 'Type A' }];
    store.dispatch({ type: 'TypeModel/GetAll/fulfilled', payload: types });
    const state = store.getState().TypeModel;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.typeModel).toEqual(types);
  });

  it('should handle GetAllTypeModel.rejected', () => {
    store.dispatch({ type: 'TypeModel/GetAll/rejected', payload: 'Err' });
    expect(store.getState().TypeModel.error).toBe('Err');
  });

  it('should handle GetAllTypeModel.rejected with default', () => {
    store.dispatch({ type: 'TypeModel/GetAll/rejected' });
    expect(store.getState().TypeModel.error).toBe('Erreur inconnue');
  });

  it('should handle UpdateTypeModel.pending', () => {
    store.dispatch({ type: 'TypeModel/Update/pending' });
    expect(store.getState().TypeModel.loading).toBe(true);
  });

  it('should handle UpdateTypeModel.fulfilled', () => {
    const item = { id: 1, name: 'Updated Type' };
    store.dispatch({ type: 'TypeModel/Update/fulfilled', payload: item });
    expect(store.getState().TypeModel.typeModel).toContainEqual(item);
  });

  it('should handle UpdateTypeModel.rejected', () => {
    store.dispatch({ type: 'TypeModel/Update/rejected', payload: 'Fail' });
    expect(store.getState().TypeModel.error).toBe('Fail');
  });

  it('should handle AjoutTypeModel.pending', () => {
    store.dispatch({ type: 'TypeModel/ADD/pending' });
    expect(store.getState().TypeModel.loading).toBe(true);
  });

  it('should handle AjoutTypeModel.fulfilled', () => {
    const item = { id: 2, name: 'New Type' };
    store.dispatch({ type: 'TypeModel/ADD/fulfilled', payload: item });
    expect(store.getState().TypeModel.typeModel).toContainEqual(item);
  });

  it('should handle AjoutTypeModel.rejected', () => {
    store.dispatch({ type: 'TypeModel/ADD/rejected', payload: 'Add fail' });
    expect(store.getState().TypeModel.error).toBe('Add fail');
  });
});
