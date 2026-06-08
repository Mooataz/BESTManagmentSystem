import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './PartPriceSlice';

describe('PartPriceSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { PartPrice: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().PartPrice;
    expect(state.PartPrice).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { PartPrice: reducer },
      preloadedState: {
        PartPrice: { PartPrice: [], loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().PartPrice.error).toBeNull();
  });

  it('should handle getAllPartPrice.pending', () => {
    store.dispatch({ type: 'PartPrice/getAll/pending' });
    expect(store.getState().PartPrice.loading).toBe(true);
  });

  it('should handle getAllPartPrice.fulfilled', () => {
    const prices = [{ id: 1, part: 'Part A', price: 100 }];
    store.dispatch({ type: 'PartPrice/getAll/fulfilled', payload: prices });
    const state = store.getState().PartPrice;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.PartPrice).toEqual(prices);
  });

  it('should handle getAllPartPrice.rejected', () => {
    store.dispatch({ type: 'PartPrice/getAll/rejected', payload: 'Err' });
    expect(store.getState().PartPrice.error).toBe('Err');
  });

  it('should handle getAllPartPrice.rejected with default', () => {
    store.dispatch({ type: 'PartPrice/getAll/rejected' });
    expect(store.getState().PartPrice.error).toBe('Erreur inconnue');
  });

  it('should handle AddOnePartPrice.pending', () => {
    store.dispatch({ type: 'PartPrice/AddPartPrice/pending' });
    expect(store.getState().PartPrice.loading).toBe(true);
  });

  it('should handle AddOnePartPrice.fulfilled', () => {
    const item = { id: 2, part: 'Part B', price: 200 };
    store.dispatch({ type: 'PartPrice/AddPartPrice/fulfilled', payload: item });
    expect(store.getState().PartPrice.PartPrice).toContainEqual(item);
  });

  it('should handle AddOnePartPrice.rejected', () => {
    store.dispatch({ type: 'PartPrice/AddPartPrice/rejected', payload: 'Add fail' });
    expect(store.getState().PartPrice.error).toBe('Add fail');
  });
});
