import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './DeviceSlice';

describe('DeviceSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { Device: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().Device;
    expect(state.device).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { Device: reducer },
      preloadedState: {
        Device: { device: [], loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().Device.error).toBeNull();
  });

  it('should handle AddDevice.pending', () => {
    store.dispatch({ type: 'repair/AddDevice/pending' });
    expect(store.getState().Device.loading).toBe(true);
  });

  it('should handle AddDevice.fulfilled', () => {
    const device = { id: 1, serialenumber: 'SN001', model: 1, purchaseDate: '2024-01-01' };
    store.dispatch({ type: 'repair/AddDevice/fulfilled', payload: device });
    const state = store.getState().Device;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.device).toEqual([device]);
  });

  it('should handle AddDevice.rejected', () => {
    store.dispatch({ type: 'repair/AddDevice/rejected', payload: 'Erreur' });
    const state = store.getState().Device;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur');
  });

  it('should handle AddDevice.rejected with default error', () => {
    store.dispatch({ type: 'repair/AddDevice/rejected' });
    expect(store.getState().Device.error).toBe('Erreur inconnue');
  });

  it('should handle UpdateOneDevice.pending', () => {
    store.dispatch({ type: 'device/update/pending' });
    expect(store.getState().Device.loading).toBe(true);
  });

  it('should handle UpdateOneDevice.fulfilled', () => {
    const device = { id: 1, serialenumber: 'SN002', model: 2, purchaseDate: '2024-02-01' };
    store.dispatch({ type: 'device/update/fulfilled', payload: device });
    const state = store.getState().Device;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.device).toEqual([device]);
  });

  it('should handle UpdateOneDevice.rejected', () => {
    store.dispatch({ type: 'device/update/rejected', payload: 'Update failed' });
    expect(store.getState().Device.error).toBe('Update failed');
  });
});
