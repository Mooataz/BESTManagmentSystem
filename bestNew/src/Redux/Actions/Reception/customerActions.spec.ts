import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getCustomers, getOneCustomer, AddCustomer, UpdateOneCustomer } from './customerActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('customerActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getCustomers should GET customers and return data', async () => {
    const mockData = [{ id: 1, name: 'John' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getCustomers());
    expect(API.get).toHaveBeenCalledWith('customers');
    expect(result.payload).toEqual(mockData);
  });

  it('getCustomers should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getCustomers());
    expect(result.type).toBe('customer/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération des bins');
  });

  it('getOneCustomer should GET customers/{id} and return data', async () => {
    const mockData = { id: 1, name: 'John' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneCustomer(1));
    expect(API.get).toHaveBeenCalledWith('customers/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOneCustomer should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneCustomer(1));
    expect(result.type).toBe('customer/getOne/rejected');
    expect(result.payload).toBe('Échec de la récupération des bins');
  });

  it('AddCustomer should POST to customers/findByName/ and return data', async () => {
    const mockData = { id: 1, name: 'John' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddCustomer(mockData as any));
    expect(API.post).toHaveBeenCalledWith('customers/findByName/', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddCustomer should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddCustomer({} as any));
    expect(result.type).toBe('repair/AddCustomer/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });

  it('UpdateOneCustomer should PATCH to customers/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Jane' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneCustomer(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('customers/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneCustomer should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneCustomer({} as any));
    expect(result.type).toBe('customer/Update/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });
});
