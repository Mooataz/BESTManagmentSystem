import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './modelsSlise';

describe('modelsSlise', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { models: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().models;
    expect(state.models).toEqual([]);
    expect(state.Onemodel).toBeNull();
    expect(state.currentmodels).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { models: reducer },
      preloadedState: {
        models: { models: [], Onemodel: null, currentmodels: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().models.error).toBeNull();
  });

  it('should handle getModelsAuthorised.pending', () => {
    store.dispatch({ type: 'models/findByBrandAuthorised/pending' });
    expect(store.getState().models.loading).toBe(true);
  });

  it('should handle getModelsAuthorised.fulfilled', () => {
    const models = [{ id: 1, name: 'Model A', brand: 'Brand A' }];
    store.dispatch({ type: 'models/findByBrandAuthorised/fulfilled', payload: models });
    const state = store.getState().models;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.models).toEqual(models);
  });

  it('should handle getModelsAuthorised.rejected', () => {
    store.dispatch({ type: 'models/findByBrandAuthorised/rejected', payload: 'Err' });
    expect(store.getState().models.error).toBe('Err');
  });

  it('should handle getOneModel.pending', () => {
    store.dispatch({ type: 'models/OneModel/pending' });
    expect(store.getState().models.loading).toBe(true);
  });

  it('should handle getOneModel.fulfilled', () => {
    const model = { id: 2, name: 'Model B', brand: 'Brand B' };
    store.dispatch({ type: 'models/OneModel/fulfilled', payload: model });
    expect(store.getState().models.Onemodel).toEqual(model);
  });

  it('should handle getOneModel.rejected', () => {
    store.dispatch({ type: 'models/OneModel/rejected', payload: 'Not found' });
    expect(store.getState().models.error).toBe('Not found');
  });

  it('should handle getAllModel.pending', () => {
    store.dispatch({ type: 'models/GetAllModel/pending' });
    expect(store.getState().models.loading).toBe(true);
  });

  it('should handle getAllModel.fulfilled', () => {
    const models = [{ id: 3, name: 'Model C', brand: 'Brand C' }];
    store.dispatch({ type: 'models/GetAllModel/fulfilled', payload: models });
    expect(store.getState().models.models).toEqual(models);
  });

  it('should handle getAllModel.rejected', () => {
    store.dispatch({ type: 'models/GetAllModel/rejected', payload: 'Fail' });
    expect(store.getState().models.error).toBe('Fail');
  });

  it('should handle UpdateModel.pending', () => {
    store.dispatch({ type: 'models/UpdateModel/pending' });
    expect(store.getState().models.loading).toBe(true);
  });

  it('should handle UpdateModel.fulfilled', () => {
    const model = { id: 1, name: 'Updated', brand: 'Brand' };
    store.dispatch({ type: 'models/UpdateModel/fulfilled', payload: model });
    expect(store.getState().models.models).toContainEqual(model);
  });

  it('should handle UpdateModel.rejected', () => {
    store.dispatch({ type: 'models/UpdateModel/rejected', payload: 'Err' });
    expect(store.getState().models.error).toBe('Err');
  });

  it('should handle AddModel.pending', () => {
    store.dispatch({ type: 'models/AddModel/pending' });
    expect(store.getState().models.loading).toBe(true);
  });

  it('should handle AddModel.fulfilled', () => {
    const model = { id: 4, name: 'New Model', brand: 'New Brand' };
    store.dispatch({ type: 'models/AddModel/fulfilled', payload: model });
    expect(store.getState().models.models).toContainEqual(model);
  });

  it('should handle AddModel.rejected', () => {
    store.dispatch({ type: 'models/AddModel/rejected', payload: 'Add failed' });
    expect(store.getState().models.error).toBe('Add failed');
  });

  it('should handle rejected with default error', () => {
    store.dispatch({ type: 'models/AddModel/rejected' });
    expect(store.getState().models.error).toBe('Erreur inconnue');
  });
});
