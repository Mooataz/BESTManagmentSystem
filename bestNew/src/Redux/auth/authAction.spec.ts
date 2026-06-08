import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { loginUser, handleLogout, getCurrentUser } from '../Actions/authAction';
import authReducer from './authSlice';

const { mockPost, mockGet } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGet: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  API: {
    post: mockPost,
    get: mockGet,
  },
  API_BASE_URL: 'http://localhost:3000',
}));

describe('authAction', () => {
  beforeEach(() => {
    mockPost.mockReset();
    mockGet.mockReset();
  });

  it('loginUser should POST to /auth/signIn and update store on success', async () => {
    const userData = { id: 1, login: 'admin', name: 'Admin', role: ['admin'], status: 'active' };
    mockPost.mockResolvedValue({ data: { user: userData } });

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(loginUser({ login: 'admin', password: 'secret' }));

    expect(mockPost).toHaveBeenCalledWith('/auth/signIn', { login: 'admin', password: 'secret' });
    const state = store.getState().auth;
    expect(state.user).toEqual(userData);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
  });

  it('loginUser should reject with error message on failure', async () => {
    mockPost.mockRejectedValue({
      response: { data: { message: 'Identifiants invalides' } },
    });

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(loginUser({ login: 'bad', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.error).toBe('Identifiants invalides');
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
  });

  it('loginUser should reject with default message when no response data', async () => {
    mockPost.mockRejectedValue(new Error('Network Error'));

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(loginUser({ login: 'bad', password: 'wrong' }));

    expect(store.getState().auth.error).toBe('Échec de la connexion');
  });

  it('handleLogout should GET auth/logout on success', async () => {
    mockGet.mockResolvedValue({});

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(handleLogout());

    expect(mockGet).toHaveBeenCalledWith('auth/logout');
  });

  it('handleLogout should reject with error message on failure', async () => {
    mockGet.mockRejectedValue({
      response: { data: { message: 'Session déjà expirée' } },
    });

    const store = configureStore({ reducer: { auth: authReducer } });
    await store.dispatch(handleLogout());

    expect(store.getState().auth.error).toBe('Session déjà expirée');
  });

  it('getCurrentUser should GET auth/me and return user data on success', async () => {
    const userData = { id: 1, login: 'admin', name: 'Admin', role: ['admin'], status: 'active' };
    mockGet.mockResolvedValue({ data: userData });

    const store = configureStore({ reducer: { auth: authReducer } });
    const result = await store.dispatch(getCurrentUser());

    expect(mockGet).toHaveBeenCalledWith('auth/me');
    expect(result.payload).toEqual(userData);
    expect(result.type).toBe('auth/me/fulfilled');
  });

  it('getCurrentUser should reject on failure', async () => {
    mockGet.mockRejectedValue(new Error('Network Error'));

    const store = configureStore({ reducer: { auth: authReducer } });
    const result = await store.dispatch(getCurrentUser());

    expect(mockGet).toHaveBeenCalledWith('auth/me');
    expect(result.type).toBe('auth/me/rejected');
  });
});
