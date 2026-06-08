import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './AccessorySlice';

describe('AccessorySlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { accessory: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().accessory;
    expect(state.accessory).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { accessory: reducer },
      preloadedState: {
        accessory: { accessory: [], loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().accessory.error).toBeNull();
  });

  it('should handle GetAllAccessory.pending', () => {
    store.dispatch({ type: 'accessory/GetAll/pending' });
    expect(store.getState().accessory.loading).toBe(true);
  });

  it('should handle GetAllAccessory.fulfilled', () => {
    const items = [{ id: 1, name: 'Acc A' }];
    store.dispatch({ type: 'accessory/GetAll/fulfilled', payload: items });
    const state = store.getState().accessory;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.accessory).toEqual(items);
  });

  it('should handle GetAllAccessory.rejected', () => {
    store.dispatch({ type: 'accessory/GetAll/rejected', payload: 'Err' });
    expect(store.getState().accessory.error).toBe('Err');
  });

  it('should handle GetAllAccessory.rejected with default', () => {
    store.dispatch({ type: 'accessory/GetAll/rejected' });
    expect(store.getState().accessory.error).toBe('Erreur inconnue');
  });

  it('should handle UpdateAcesory.pending', () => {
    store.dispatch({ type: 'accessory/Update/pending' });
    expect(store.getState().accessory.loading).toBe(true);
  });

  it('should handle UpdateAcesory.fulfilled', () => {
    const item = { id: 1, name: 'Updated Acc' };
    store.dispatch({ type: 'accessory/Update/fulfilled', payload: item });
    expect(store.getState().accessory.accessory).toContainEqual(item);
  });

  it('should handle UpdateAcesory.rejected', () => {
    store.dispatch({ type: 'accessory/Update/rejected', payload: 'Fail' });
    expect(store.getState().accessory.error).toBe('Fail');
  });

  it('should handle AddAcesory.pending', () => {
    store.dispatch({ type: 'accessory/Add/pending' });
    expect(store.getState().accessory.loading).toBe(true);
  });

  it('should handle AddAcesory.fulfilled', () => {
    const item = { id: 2, name: 'New Acc' };
    store.dispatch({ type: 'accessory/Add/fulfilled', payload: item });
    expect(store.getState().accessory.accessory).toContainEqual(item);
  });

  it('should handle AddAcesory.rejected', () => {
    store.dispatch({ type: 'accessory/Add/rejected', payload: 'Add fail' });
    expect(store.getState().accessory.error).toBe('Add fail');
  });
});
