import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getCustomerRequest } from './RequestCustomerActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('RequestCustomerActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getCustomerRequest should GET customer-request and return data', async () => {
    const mockData = [{ id: 1, name: 'Request1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getCustomerRequest());
    expect(API.get).toHaveBeenCalledWith('customer-request');
    expect(result.payload).toEqual(mockData);
  });

  it('getCustomerRequest should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getCustomerRequest());
    expect(result.type).toBe('CustomerRequest/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });
});
