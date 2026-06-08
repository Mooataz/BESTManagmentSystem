import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { clearError, setBranch } from './authSlice';
import type { Agency } from '../Types/Stock';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { auth: authReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { user: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });

  it('should handle setBranch when user exists', () => {
    const branch: Agency = { id: 1, name: 'Main Branch', phone: 123456789, email: 'branch@test.com', location: 'Downtown' };
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { user: { login: 'admin', name: 'Admin', role: ['admin'], status: 'active' }, loading: false, success: false, error: null },
      },
    });
    store.dispatch(setBranch(branch));
    expect(store.getState().auth.user?.branch).toEqual(branch);
  });

  it('should handle setBranch when user is null (should not crash)', () => {
    const branch: Agency = { id: 2, name: 'Branch 2', phone: 0, email: '', location: '' };
    store.dispatch(setBranch(branch));
    expect(store.getState().auth.user).toBeNull();
  });

  it('should handle loginUser.pending', () => {
    store.dispatch({ type: 'auth/login/pending' });
    expect(store.getState().auth.loading).toBe(true);
    expect(store.getState().auth.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const user = { id: 1, login: 'test', name: 'Test User', role: ['user'], status: 'active' };
    store.dispatch({ type: 'auth/login/fulfilled', payload: user });
    expect(store.getState().auth.loading).toBe(false);
    expect(store.getState().auth.success).toBe(true);
    expect(store.getState().auth.user).toEqual(user);
  });

  it('should handle loginUser.rejected', () => {
    store.dispatch({ type: 'auth/login/rejected', payload: 'Invalid credentials' });
    expect(store.getState().auth.loading).toBe(false);
    expect(store.getState().auth.success).toBe(false);
    expect(store.getState().auth.error).toBe('Invalid credentials');
  });

  it('should handle loginUser.rejected with default error when no payload', () => {
    store.dispatch({ type: 'auth/login/rejected' });
    expect(store.getState().auth.error).toBe('Unknown error');
  });

  it('should handle handleLogout.pending', () => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { user: { login: 'x', name: 'X', role: [], status: 'active' }, loading: false, success: true, error: null },
      },
    });
    store.dispatch({ type: 'auth/logout/pending' });
    expect(store.getState().auth.loading).toBe(true);
  });

  it('should handle handleLogout.fulfilled', () => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { user: { login: 'x', name: 'X', role: [], status: 'active' }, loading: true, success: true, error: 'err' },
      },
    });
    store.dispatch({ type: 'auth/logout/fulfilled' });
    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle handleLogout.rejected', () => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { user: { login: 'x', name: 'X', role: [], status: 'active' }, loading: true, success: false, error: null },
      },
    });
    store.dispatch({ type: 'auth/logout/rejected', payload: 'Logout failed' });
    const state = store.getState().auth;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Logout failed');
  });
});
