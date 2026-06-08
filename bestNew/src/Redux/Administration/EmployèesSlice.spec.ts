import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import employesReducer, { clearError } from './EmployèesSlice';
import type { User } from '../Types/authenTypes';

describe('EmployèesSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { Employèes: employesReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().Employèes;
    expect(state.Employèes).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { Employèes: employesReducer },
      preloadedState: {
        Employèes: { Employèes: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().Employèes.error).toBeNull();
  });

  it('should handle getusers.pending', () => {
    store.dispatch({ type: 'Employèes/get/pending' });
    expect(store.getState().Employèes.loading).toBe(true);
  });

  it('should handle getusers.fulfilled', () => {
    const payload: User[] = [{ id: 1, login: 'jdoe', name: 'John', role: ['admin'], status: 'active' }];
    store.dispatch({ type: 'Employèes/get/fulfilled', payload });
    const state = store.getState().Employèes;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.Employèes).toEqual(payload);
  });

  it('should handle getusers.rejected', () => {
    store.dispatch({ type: 'Employèes/get/rejected' });
    expect(store.getState().Employèes.error).toBe('Erreur inconnue');
  });

  it('should handle updateEmployee.pending', () => {
    store.dispatch({ type: 'Employèes/Update/pending' });
    expect(store.getState().Employèes.loading).toBe(true);
  });

  it('should handle updateEmployee.fulfilled', () => {
    const payload: User[] = [{ id: 1, login: 'jdoe', name: 'John Updated', role: ['user'], status: 'active' }];
    store.dispatch({ type: 'Employèes/Update/fulfilled', payload });
    expect(store.getState().Employèes.Employèes).toEqual(payload);
  });

  it('should handle updateEmployee.rejected', () => {
    store.dispatch({ type: 'Employèes/Update/rejected', payload: 'Échec' });
    expect(store.getState().Employèes.error).toBe('Échec');
  });

  it('should handle updatePassword.pending', () => {
    store.dispatch({ type: 'Employèes/updatePassword/pending' });
    expect(store.getState().Employèes.loading).toBe(true);
  });

  it('should handle updatePassword.fulfilled', () => {
    const payload: User = { id: 2, login: 'jane', name: 'Jane', role: ['tech'], status: 'active' };
    store.dispatch({ type: 'Employèes/updatePassword/fulfilled', payload });
    const state = store.getState().Employèes;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.Employèes).toContainEqual(payload);
  });

  it('should handle updatePassword.rejected', () => {
    store.dispatch({ type: 'Employèes/updatePassword/rejected' });
    expect(store.getState().Employèes.error).toBe('Erreur inconnue');
  });
});
