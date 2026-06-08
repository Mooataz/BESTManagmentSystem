import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import customerRequestReducer, { clearError } from './CustomerRequestSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('CustomerRequestSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { CustomerRequest: customerRequestReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().CustomerRequest;
    expect(state.customerRequest).toEqual([]);
    expect(state.currentallcustomerRequest).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { CustomerRequest: customerRequestReducer },
      preloadedState: {
        CustomerRequest: { customerRequest: [], currentallcustomerRequest: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().CustomerRequest.error).toBeNull();
  });

  it('should handle getCustomerRequest.pending', () => {
    store.dispatch({ type: 'CustomerRequest/getAll/pending' });
    const state = store.getState().CustomerRequest;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle getCustomerRequest.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Demande client A' }];
    store.dispatch({ type: 'CustomerRequest/getAll/fulfilled', payload });
    const state = store.getState().CustomerRequest;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.customerRequest).toEqual(payload);
  });

  it('should handle getCustomerRequest.rejected', () => {
    store.dispatch({ type: 'CustomerRequest/getAll/rejected' });
    const state = store.getState().CustomerRequest;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur inconnue');
  });

  it('should handle getCustomerRequest.rejected with payload', () => {
    store.dispatch({ type: 'CustomerRequest/getAll/rejected', payload: 'Erreur réseau' });
    expect(store.getState().CustomerRequest.error).toBe('Erreur réseau');
  });
});
