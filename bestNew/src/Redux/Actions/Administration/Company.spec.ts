import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getCompany, updateCompany } from './Company';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Company', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getCompany should GET company and return first data item', async () => {
    const mockData = [{ id: 1, name: 'Company1' }, { id: 2 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getCompany());
    expect(API.get).toHaveBeenCalledWith('company');
    expect(result.payload).toEqual(mockData[0]);
  });

  it('getCompany should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getCompany());
    expect(result.type).toBe('company/get/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('updateCompany should PATCH to company/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateCompany({ id: 1, name: 'Updated' }));
    expect(API.patch).toHaveBeenCalledWith('company/1', { id: 1, name: 'Updated' });
    expect(result.payload).toEqual(mockData);
  });

  it('updateCompany should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateCompany({ id: 1 }));
    expect(result.type).toBe('company/Update/rejected');
    expect(result.payload).toBe('Échec');
  });
});
