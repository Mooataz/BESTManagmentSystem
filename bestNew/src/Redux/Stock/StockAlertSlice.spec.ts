import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearAlertError } from './StockAlertSlice';

describe('StockAlertSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { stockAlert: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().stockAlert;
    expect(state.alerts).toEqual([]);
    expect(state.unreadCount).toBe(0);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearAlertError', () => {
    store = configureStore({
      reducer: { stockAlert: reducer },
      preloadedState: {
        stockAlert: { alerts: [], unreadCount: 0, loading: false, error: 'some error' },
      },
    });
    store.dispatch(clearAlertError());
    expect(store.getState().stockAlert.error).toBeNull();
  });

  it('should handle getStockAlerts.pending', () => {
    store.dispatch({ type: 'stockAlert/getAlerts/pending' });
    const state = store.getState().stockAlert;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getStockAlerts.fulfilled', () => {
    const alerts = [
      { id: 1, branchId: 1, report: [], readBy: [], createdAt: '2024-01-01', isRead: false },
      { id: 2, branchId: 1, report: [], readBy: [], createdAt: '2024-01-02', isRead: true },
    ];
    store.dispatch({ type: 'stockAlert/getAlerts/fulfilled', payload: alerts });
    const state = store.getState().stockAlert;
    expect(state.loading).toBe(false);
    expect(state.alerts).toEqual(alerts);
    expect(state.unreadCount).toBe(1);
  });

  it('should handle getStockAlerts.rejected', () => {
    store.dispatch({ type: 'stockAlert/getAlerts/rejected', payload: 'Erreur réseau' });
    const state = store.getState().stockAlert;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Erreur réseau');
  });

  it('should handle getStockAlerts.rejected with default error', () => {
    store.dispatch({ type: 'stockAlert/getAlerts/rejected' });
    expect(store.getState().stockAlert.error).toBe('Erreur');
  });

  it('should handle markAlertRead.fulfilled', () => {
    const existingAlert = { id: 1, branchId: 1, report: [], readBy: [], createdAt: '2024-01-01', isRead: false };
    store = configureStore({
      reducer: { stockAlert: reducer },
      preloadedState: {
        stockAlert: { alerts: [existingAlert], unreadCount: 1, loading: false, error: null },
      },
    });
    const updatedAlert = { ...existingAlert, isRead: true, readBy: [1] };
    store.dispatch({ type: 'stockAlert/markRead/fulfilled', payload: updatedAlert });
    const state = store.getState().stockAlert;
    expect(state.alerts[0].isRead).toBe(true);
    expect(state.unreadCount).toBe(0);
  });

  it('should handle markAlertRead.fulfilled with unknown id', () => {
    const alert = { id: 99, branchId: 1, report: [], readBy: [], createdAt: '2024-01-01', isRead: true };
    store.dispatch({ type: 'stockAlert/markRead/fulfilled', payload: alert });
    expect(store.getState().stockAlert.unreadCount).toBe(0);
  });
});
