import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser, setBranch, clearUser } from './userSlice';
import type { UserState } from './userSlice';

const initialState: UserState = {
  id: 0,
  name: '',
  login: '',
  status: '',
  role: [],
  branch: { id: 0, name: '', phone: 0, email: '', location: '' },
};

describe('userSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { user: userReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().user;
    expect(state).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const payload: UserState = {
      id: 1,
      login: 'jdoe',
      name: 'John Doe',
      status: 'active',
      role: ['admin', 'manager'],
      branch: { id: 3, name: 'North Branch', phone: 111222333, email: 'north@test.com', location: 'Uptown' },
    };
    store.dispatch(setUser(payload));
    expect(store.getState().user).toEqual(payload);
  });

  it('should handle setBranch', () => {
    const branch = { id: 5, name: 'East Wing', phone: 444555666, email: 'east@test.com', location: 'Eastside' };
    store.dispatch(setBranch(branch));
    expect(store.getState().user.branch).toEqual(branch);
  });

  it('should handle clearUser', () => {
    store = configureStore({
      reducer: { user: userReducer },
      preloadedState: {
        user: { id: 1, login: 'jdoe', name: 'John Doe', status: 'active', role: ['admin'], branch: { id: 3, name: 'North Branch', phone: 111222333, email: 'north@test.com', location: 'Uptown' } },
      },
    });
    store.dispatch(clearUser());
    expect(store.getState().user).toEqual(initialState);
  });
});
