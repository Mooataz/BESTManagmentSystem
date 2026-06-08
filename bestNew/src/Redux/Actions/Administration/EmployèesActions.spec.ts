import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getusers, updateEmployee, AddEmployee, updatePassword } from './EmployèesActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('EmployèesActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getusers should GET users and return data', async () => {
    const mockData = [{ id: 1, login: 'user1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getusers());
    expect(API.get).toHaveBeenCalledWith('users');
    expect(result.payload).toEqual(mockData);
  });

  it('getusers should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getusers());
    expect(result.type).toBe('Employèes/get/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('updateEmployee should PATCH to users/{id} and return data', async () => {
    const mockData = [{ id: 1, login: 'updated' }];
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateEmployee({ id: 1, login: 'updated' }));
    expect(API.patch).toHaveBeenCalledWith('users/1', { id: 1, login: 'updated' });
    expect(result.payload).toEqual(mockData);
  });

  it('updateEmployee should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateEmployee({ id: 1 }));
    expect(result.type).toBe('Employèes/Update/rejected');
    expect(result.payload).toBe('Échec');
  });

  it('AddEmployee should POST to users and return data', async () => {
    const mockData = { id: 1, login: 'newuser' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddEmployee(mockData as any));
    expect(API.post).toHaveBeenCalledWith('users', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddEmployee should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddEmployee({} as any));
    expect(result.type).toBe('Employèes/Ajoute/rejected');
    expect(result.payload).toBe('Échec');
  });

  it('updatePassword should PATCH to auth/password/{id} with headers', async () => {
    const mockData = { id: 1, login: 'user' };
    localStorage.setItem('accessToken', 'token123');
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(updatePassword({ id: 1, currentPassword: 'old', newPassword: 'new' }));
    expect(API.patch).toHaveBeenCalledWith('auth/password/1', { currentPassword: 'old', newPassword: 'new' }, { headers: { Authorization: 'Bearer token123' } });
    expect(result.payload).toEqual(mockData);
    localStorage.removeItem('accessToken');
  });

  it('updatePassword should reject on failure', async () => {
    localStorage.setItem('accessToken', 'token123');
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(updatePassword({ id: 1, currentPassword: 'old', newPassword: 'new' }));
    expect(result.type).toBe('Employèes/updatePassword/rejected');
    expect(result.payload).toBe('Échec');
    localStorage.removeItem('accessToken');
  });
});
