import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './binSlice';

describe('binSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { bin: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().bin;
    expect(state.bin).toEqual([]);
    expect(state.BinByName).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { bin: reducer },
      preloadedState: {
        bin: { bin: [], BinByName: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().bin.error).toBeNull();
  });

  it('should handle addBin.pending', () => {
    store.dispatch({ type: 'bin/AddOneBin/pending' });
    expect(store.getState().bin.loading).toBe(true);
  });

  it('should handle addBin.fulfilled', () => {
    const bin = { id: 1, name: 'Bin A', type: 'type1', branch: 1 };
    store.dispatch({ type: 'bin/AddOneBin/fulfilled', payload: bin });
    expect(store.getState().bin.bin).toContainEqual(bin);
  });

  it('should handle addBin.rejected', () => {
    store.dispatch({ type: 'bin/AddOneBin/rejected', payload: 'Err' });
    expect(store.getState().bin.error).toBe('Err');
  });

  it('should handle getBin.pending', () => {
    store.dispatch({ type: 'bin/getByBranch/pending' });
    expect(store.getState().bin.loading).toBe(true);
  });

  it('should handle getBin.fulfilled', () => {
    const bins = [{ id: 1, name: 'Bin A' }];
    store.dispatch({ type: 'bin/getByBranch/fulfilled', payload: bins });
    expect(store.getState().bin.bin).toEqual(bins);
  });

  it('should handle getBin.rejected', () => {
    store.dispatch({ type: 'bin/getByBranch/rejected', payload: 'Err' });
    expect(store.getState().bin.error).toBe('Err');
  });

  it('should handle findByBinName.pending', () => {
    store.dispatch({ type: 'bin/getBinByName/pending' });
    expect(store.getState().bin.loading).toBe(true);
  });

  it('should handle findByBinName.fulfilled', () => {
    const bin = { id: 2, name: 'Bin B' };
    store.dispatch({ type: 'bin/getBinByName/fulfilled', payload: bin });
    expect(store.getState().bin.BinByName).toEqual(bin);
  });

  it('should handle findByBinName.rejected', () => {
    store.dispatch({ type: 'bin/getBinByName/rejected', payload: 'Not found' });
    expect(store.getState().bin.error).toBe('Not found');
  });

  it('should handle findByBranchType.pending', () => {
    store.dispatch({ type: 'bin/getBinBranchType/pending' });
    expect(store.getState().bin.loading).toBe(true);
  });

  it('should handle findByBranchType.fulfilled', () => {
    const bins = [{ id: 3, name: 'Bin C' }];
    store.dispatch({ type: 'bin/getBinBranchType/fulfilled', payload: bins });
    expect(store.getState().bin.bin).toEqual(bins);
  });

  it('should handle findByBranchType.rejected', () => {
    store.dispatch({ type: 'bin/getBinBranchType/rejected', payload: 'Fail' });
    expect(store.getState().bin.error).toBe('Fail');
  });

  it('should handle rejected with default error', () => {
    store.dispatch({ type: 'bin/AddOneBin/rejected' });
    expect(store.getState().bin.error).toBe('Erreur inconnue');
  });
});
