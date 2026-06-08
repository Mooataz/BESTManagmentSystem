import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './OutPutSlice';

describe('OutPutSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { OutputList: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().OutputList;
    expect(state.out).toEqual([]);
    expect(state.Oneout).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { OutputList: reducer },
      preloadedState: {
        OutputList: { out: [], Oneout: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().OutputList.error).toBeNull();
  });

  it('should handle addOutPut.pending', () => {
    store.dispatch({ type: 'OutputList/addOutPut/pending' });
    expect(store.getState().OutputList.loading).toBe(true);
  });

  it('should handle addOutPut.fulfilled', () => {
    const item = { id: 1, reference: 'OUT001' };
    store.dispatch({ type: 'OutputList/addOutPut/fulfilled', payload: item });
    expect(store.getState().OutputList.out).toContainEqual(item);
  });

  it('should handle addOutPut.rejected', () => {
    store.dispatch({ type: 'OutputList/addOutPut/rejected', payload: 'Err' });
    expect(store.getState().OutputList.error).toBe('Err');
  });

  it('should handle addOutPut.rejected with default error', () => {
    store.dispatch({ type: 'OutputList/addOutPut/rejected' });
    expect(store.getState().OutputList.error).toBe('Erreur inconnue');
  });

  it('should handle GetOutPutBranch.pending', () => {
    store.dispatch({ type: 'OutputList/GetOutPutBranch/pending' });
    expect(store.getState().OutputList.loading).toBe(true);
  });

  it('should handle GetOutPutBranch.fulfilled', () => {
    const items = [{ id: 2, reference: 'BRANCH_OUT' }];
    store.dispatch({ type: 'OutputList/GetOutPutBranch/fulfilled', payload: items });
    expect(store.getState().OutputList.out).toEqual(items);
  });

  it('should handle GetOutPutBranch.rejected', () => {
    store.dispatch({ type: 'OutputList/GetOutPutBranch/rejected', payload: 'Err' });
    expect(store.getState().OutputList.error).toBe('Err');
  });

  it('should handle GetOneOutPut.pending', () => {
    store.dispatch({ type: 'OutputList/GetOneOutPut/pending' });
    expect(store.getState().OutputList.loading).toBe(true);
  });

  it('should handle GetOneOutPut.fulfilled', () => {
    const item = { id: 3, reference: 'ONE_OUT' };
    store.dispatch({ type: 'OutputList/GetOneOutPut/fulfilled', payload: item });
    expect(store.getState().OutputList.Oneout).toEqual(item);
  });

  it('should handle GetOneOutPut.rejected', () => {
    store.dispatch({ type: 'OutputList/GetOneOutPut/rejected', payload: 'Not found' });
    expect(store.getState().OutputList.error).toBe('Not found');
  });
});
