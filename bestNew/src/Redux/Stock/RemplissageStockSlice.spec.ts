import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './RemplissageStockSlice';

describe('RemplissageStockSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { stockParts: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().stockParts;
    expect(state.stockParts).toEqual([]);
    expect(state.stockPartsBranch).toEqual([]);
    expect(state.stockPartsTransfert).toEqual([]);
    expect(state.getOnePart).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { stockParts: reducer },
      preloadedState: {
        stockParts: { stockParts: [], stockPartsBranch: [], stockPartsTransfert: [], getOnePart: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().stockParts.error).toBeNull();
  });

  it('should handle AddOneStockPart.pending', () => {
    store.dispatch({ type: 'stockParts/AddOneStock-parts/pending' });
    expect(store.getState().stockParts.loading).toBe(true);
  });

  it('should handle AddOneStockPart.fulfilled', () => {
    const part = { id: 1, partName: 'Part A' };
    store.dispatch({ type: 'stockParts/AddOneStock-parts/fulfilled', payload: part });
    expect(store.getState().stockParts.stockParts).toContainEqual(part);
  });

  it('should handle AddOneStockPart.rejected', () => {
    store.dispatch({ type: 'stockParts/AddOneStock-parts/rejected', payload: 'Err' });
    expect(store.getState().stockParts.error).toBe('Err');
  });

  it('should handle getAllStockPart.pending', () => {
    store.dispatch({ type: 'stockParts/getAll/pending' });
    expect(store.getState().stockParts.loading).toBe(true);
  });

  it('should handle getAllStockPart.fulfilled', () => {
    const parts = [{ id: 1, partName: 'All Part' }];
    store.dispatch({ type: 'stockParts/getAll/fulfilled', payload: parts });
    expect(store.getState().stockParts.stockParts).toEqual(parts);
  });

  it('should handle getAllStockPart.rejected', () => {
    store.dispatch({ type: 'stockParts/getAll/rejected', payload: 'Err' });
    expect(store.getState().stockParts.error).toBe('Err');
  });

  it('should handle getAllStockPartBranch.pending', () => {
    store.dispatch({ type: 'stockPart/getAll/pending' });
    expect(store.getState().stockParts.loading).toBe(true);
  });

  it('should handle getAllStockPartBranch.fulfilled', () => {
    const parts = [{ id: 2, partName: 'Branch Part' }];
    store.dispatch({ type: 'stockPart/getAll/fulfilled', payload: parts });
    expect(store.getState().stockParts.stockPartsBranch).toEqual(parts);
  });

  it('should handle getAllStockPartBranch.rejected', () => {
    store.dispatch({ type: 'stockPart/getAll/rejected', payload: 'Fail' });
    expect(store.getState().stockParts.error).toBe('Fail');
  });

  it('should handle getTotransfert.pending', () => {
    store.dispatch({ type: 'stockParts/getTotransfert/pending' });
    expect(store.getState().stockParts.loading).toBe(true);
  });

  it('should handle getTotransfert.fulfilled', () => {
    const parts = [{ id: 3, partName: 'Transfert Part' }];
    store.dispatch({ type: 'stockParts/getTotransfert/fulfilled', payload: parts });
    expect(store.getState().stockParts.stockPartsTransfert).toEqual(parts);
  });

  it('should handle getTotransfert.rejected', () => {
    store.dispatch({ type: 'stockParts/getTotransfert/rejected', payload: 'Err' });
    expect(store.getState().stockParts.error).toBe('Err');
  });

  it('should handle getOnePart.pending', () => {
    store.dispatch({ type: 'stockPart/getOnePart/pending' });
    expect(store.getState().stockParts.loading).toBe(true);
  });

  it('should handle getOnePart.fulfilled', () => {
    const part = { id: 4, partName: 'One Part' };
    store.dispatch({ type: 'stockPart/getOnePart/fulfilled', payload: part });
    expect(store.getState().stockParts.getOnePart).toEqual(part);
  });

  it('should handle getOnePart.rejected', () => {
    store.dispatch({ type: 'stockPart/getOnePart/rejected', payload: 'Not found' });
    expect(store.getState().stockParts.error).toBe('Not found');
  });

  it('should handle AddhistoryOnePart.pending', () => {
    store.dispatch({ type: 'stockPart/AddhistoryOnePart/pending' });
    expect(store.getState().stockParts.loading).toBe(true);
  });

  it('should handle AddhistoryOnePart.fulfilled', () => {
    const part = { id: 5, partName: 'History Part' };
    store.dispatch({ type: 'stockPart/AddhistoryOnePart/fulfilled', payload: part });
    expect(store.getState().stockParts.getOnePart).toEqual(part);
  });

  it('should handle AddhistoryOnePart.rejected', () => {
    store.dispatch({ type: 'stockPart/AddhistoryOnePart/rejected', payload: 'Err' });
    expect(store.getState().stockParts.error).toBe('Err');
  });

  it('should handle rejected with default error', () => {
    store.dispatch({ type: 'stockParts/getAll/rejected' });
    expect(store.getState().stockParts.error).toBe('Erreur inconnue');
  });
});
