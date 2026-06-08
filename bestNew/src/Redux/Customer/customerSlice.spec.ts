import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError } from './customerSlice';

describe('customerSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { customer: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().customer;
    expect(state.customer).toEqual([]);
    expect(state.oneCustomer).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { customer: reducer },
      preloadedState: {
        customer: { customer: [], oneCustomer: null, loading: false, success: false, error: 'err' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().customer.error).toBeNull();
  });

  it('should handle getCustomers.pending', () => {
    store.dispatch({ type: 'customer/getAll/pending' });
    expect(store.getState().customer.loading).toBe(true);
  });

  it('should handle getCustomers.fulfilled', () => {
    const customers = [{ id: 1, name: 'Client A', phone: '123', email: 'a@b.com' }];
    store.dispatch({ type: 'customer/getAll/fulfilled', payload: customers });
    const state = store.getState().customer;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.customer).toEqual(customers);
  });

  it('should handle getCustomers.rejected', () => {
    store.dispatch({ type: 'customer/getAll/rejected', payload: 'Échec' });
    expect(store.getState().customer.error).toBe('Échec');
  });

  it('should handle getOneCustomer.pending', () => {
    store.dispatch({ type: 'customer/getOne/pending' });
    expect(store.getState().customer.loading).toBe(true);
  });

  it('should handle getOneCustomer.fulfilled', () => {
    const cust = { id: 5, name: 'Client B', phone: '456', email: 'b@b.com' };
    store.dispatch({ type: 'customer/getOne/fulfilled', payload: cust });
    expect(store.getState().customer.oneCustomer).toEqual(cust);
  });

  it('should handle getOneCustomer.rejected', () => {
    store.dispatch({ type: 'customer/getOne/rejected', payload: 'Not found' });
    expect(store.getState().customer.error).toBe('Not found');
  });

  it('should handle AddCustomer.pending', () => {
    store.dispatch({ type: 'repair/AddCustomer/pending' });
    expect(store.getState().customer.loading).toBe(true);
  });

  it('should handle AddCustomer.fulfilled', () => {
    const cust = { id: 10, name: 'New Client', phone: '789', email: 'new@b.com' };
    store.dispatch({ type: 'repair/AddCustomer/fulfilled', payload: cust });
    const state = store.getState().customer;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.customer).toEqual([cust]);
  });

  it('should handle AddCustomer.rejected', () => {
    store.dispatch({ type: 'repair/AddCustomer/rejected', payload: 'Err' });
    expect(store.getState().customer.error).toBe('Err');
  });

  it('should handle UpdateOneCustomer.pending', () => {
    store.dispatch({ type: 'customer/Update/pending' });
    expect(store.getState().customer.loading).toBe(true);
  });

  it('should handle UpdateOneCustomer.fulfilled', () => {
    const cust = { id: 10, name: 'Updated', phone: '000', email: 'u@b.com' };
    store.dispatch({ type: 'customer/Update/fulfilled', payload: cust });
    const state = store.getState().customer;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.customer).toEqual([cust]);
  });

  it('should handle UpdateOneCustomer.rejected', () => {
    store.dispatch({ type: 'customer/Update/rejected', payload: 'Oops' });
    expect(store.getState().customer.error).toBe('Oops');
  });

  it('should handle rejected with default error when no payload', () => {
    store.dispatch({ type: 'customer/Update/rejected' });
    expect(store.getState().customer.error).toBe('Erreur inconnue');
  });
});
