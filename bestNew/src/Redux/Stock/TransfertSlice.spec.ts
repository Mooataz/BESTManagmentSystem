import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './TransfertSlice';

describe('TransfertSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { Transfert: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().Transfert;
    expect(state.Transfert).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { Transfert: reducer },
      preloadedState: {
        Transfert: { Transfert: [], loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().Transfert.error).toBeNull();
  });

  it('should handle AddOneTransfert.pending', () => {
    store.dispatch({ type: 'Transfert/AddOne/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle AddOneTransfert.fulfilled', () => {
    const t = { id: 1, reference: 'REF001' };
    store.dispatch({ type: 'Transfert/AddOne/fulfilled', payload: t });
    expect(store.getState().Transfert.Transfert).toContainEqual(t);
  });

  it('should handle AddOneTransfert.rejected', () => {
    store.dispatch({ type: 'Transfert/AddOne/rejected', payload: 'Err' });
    expect(store.getState().Transfert.error).toBe('Err');
  });

  it('should handle UpdateOneTransfert.pending', () => {
    store.dispatch({ type: 'Transfert/UpdateOne/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle UpdateOneTransfert.fulfilled (replace existing)', () => {
    const existing = { id: 1, reference: 'REF001', state: 'pending' };
    store = configureStore({
      reducer: { Transfert: reducer },
      preloadedState: { Transfert: { Transfert: [existing], loading: false, success: false, error: null } },
    });
    const updated = { id: 1, reference: 'REF001', state: 'accepted' };
    store.dispatch({ type: 'Transfert/UpdateOne/fulfilled', payload: updated });
    expect(store.getState().Transfert.Transfert).toHaveLength(1);
    expect(store.getState().Transfert.Transfert[0].state).toBe('accepted');
  });

  it('should handle UpdateOneTransfert.fulfilled (push new)', () => {
    const t = { id: 2, reference: 'REF002' };
    store.dispatch({ type: 'Transfert/UpdateOne/fulfilled', payload: t });
    expect(store.getState().Transfert.Transfert).toContainEqual(t);
  });

  it('should handle UpdateOneTransfert.rejected', () => {
    store.dispatch({ type: 'Transfert/UpdateOne/rejected', payload: 'Fail' });
    expect(store.getState().Transfert.error).toBe('Fail');
  });

  it('should handle GetSendTransfert.pending', () => {
    store.dispatch({ type: 'Transfert/GetSendTransfert/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle GetSendTransfert.fulfilled', () => {
    const items = [{ id: 3, reference: 'SEND' }];
    store.dispatch({ type: 'Transfert/GetSendTransfert/fulfilled', payload: items });
    expect(store.getState().Transfert.Transfert).toEqual(items);
  });

  it('should handle GetSendTransfert.rejected', () => {
    store.dispatch({ type: 'Transfert/GetSendTransfert/rejected', payload: 'Err' });
    expect(store.getState().Transfert.error).toBe('Err');
  });

  it('should handle GetReceiveTransfert.pending', () => {
    store.dispatch({ type: 'Transfert/GetReceiveTransfert/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle GetReceiveTransfert.fulfilled', () => {
    const items = [{ id: 4, reference: 'RECV' }];
    store.dispatch({ type: 'Transfert/GetReceiveTransfert/fulfilled', payload: items });
    expect(store.getState().Transfert.Transfert).toEqual(items);
  });

  it('should handle GetReceiveTransfert.rejected', () => {
    store.dispatch({ type: 'Transfert/GetReceiveTransfert/rejected', payload: 'Err' });
    expect(store.getState().Transfert.error).toBe('Err');
  });

  it('should handle FetchRepairTransfers.pending', () => {
    store.dispatch({ type: 'Transfert/FetchRepairTransfers/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle FetchRepairTransfers.fulfilled', () => {
    const items = [{ id: 5, reference: 'REPAIR' }];
    store.dispatch({ type: 'Transfert/FetchRepairTransfers/fulfilled', payload: items });
    expect(store.getState().Transfert.Transfert).toEqual(items);
  });

  it('should handle FetchRepairTransfers.rejected', () => {
    store.dispatch({ type: 'Transfert/FetchRepairTransfers/rejected', payload: 'Err' });
    expect(store.getState().Transfert.error).toBe('Err');
  });

  it('should handle AcceptRepairTransfer.pending', () => {
    store.dispatch({ type: 'Transfert/AcceptRepairTransfer/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle AcceptRepairTransfer.fulfilled', () => {
    const existing = { id: 10, reference: 'REF10', state: 'pending' };
    store = configureStore({
      reducer: { Transfert: reducer },
      preloadedState: { Transfert: { Transfert: [existing], loading: false, success: false, error: null } },
    });
    const updated = { id: 10, reference: 'REF10', state: 'accepted' };
    store.dispatch({ type: 'Transfert/AcceptRepairTransfer/fulfilled', payload: updated });
    expect(store.getState().Transfert.Transfert[0].state).toBe('accepted');
  });

  it('should handle AcceptRepairTransfer.rejected', () => {
    store.dispatch({ type: 'Transfert/AcceptRepairTransfer/rejected', payload: 'Fail' });
    expect(store.getState().Transfert.error).toBe('Fail');
  });

  it('should handle RefuseRepairTransfer.pending', () => {
    store.dispatch({ type: 'Transfert/RefuseRepairTransfer/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle RefuseRepairTransfer.fulfilled', () => {
    const existing = { id: 11, reference: 'REF11', state: 'pending' };
    store = configureStore({
      reducer: { Transfert: reducer },
      preloadedState: { Transfert: { Transfert: [existing], loading: false, success: false, error: null } },
    });
    const updated = { id: 11, reference: 'REF11', state: 'refused' };
    store.dispatch({ type: 'Transfert/RefuseRepairTransfer/fulfilled', payload: updated });
    expect(store.getState().Transfert.Transfert[0].state).toBe('refused');
  });

  it('should handle RefuseRepairTransfer.rejected', () => {
    store.dispatch({ type: 'Transfert/RefuseRepairTransfer/rejected', payload: 'Fail' });
    expect(store.getState().Transfert.error).toBe('Fail');
  });

  it('should handle CancelRepairTransfer.pending', () => {
    store.dispatch({ type: 'Transfert/CancelRepairTransfer/pending' });
    expect(store.getState().Transfert.loading).toBe(true);
  });

  it('should handle CancelRepairTransfer.fulfilled', () => {
    const existing = { id: 12, reference: 'REF12', state: 'pending' };
    store = configureStore({
      reducer: { Transfert: reducer },
      preloadedState: { Transfert: { Transfert: [existing], loading: false, success: false, error: null } },
    });
    const updated = { id: 12, reference: 'REF12', state: 'cancelled' };
    store.dispatch({ type: 'Transfert/CancelRepairTransfer/fulfilled', payload: updated });
    expect(store.getState().Transfert.Transfert[0].state).toBe('cancelled');
  });

  it('should handle CancelRepairTransfer.rejected', () => {
    store.dispatch({ type: 'Transfert/CancelRepairTransfer/rejected', payload: 'Fail' });
    expect(store.getState().Transfert.error).toBe('Fail');
  });

  it('should handle rejected with default error', () => {
    store.dispatch({ type: 'Transfert/AddOne/rejected' });
    expect(store.getState().Transfert.error).toBe('Erreur inconnue');
  });
});
