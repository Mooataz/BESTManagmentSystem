import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getDemandeClient, AddDemandeClient, UpdateOneDemandeClient } from './DemandeClient';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('DemandeClient', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getDemandeClient should GET customer-request and return data', async () => {
    const mockData = [{ id: 1, name: 'Demande1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getDemandeClient());
    expect(API.get).toHaveBeenCalledWith('customer-request');
    expect(result.payload).toEqual(mockData);
  });

  it('getDemandeClient should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getDemandeClient());
    expect(result.type).toBe('DemandeClient/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('AddDemandeClient should POST to customer-request/ and return data', async () => {
    const mockData = { id: 1, name: 'New' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddDemandeClient(mockData as any));
    expect(API.post).toHaveBeenCalledWith('customer-request/', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddDemandeClient should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddDemandeClient({} as any));
    expect(result.type).toBe('DemandeClient/add/rejected');
    expect(result.payload).toBe('Échec de création ');
  });

  it('UpdateOneDemandeClient should PATCH to customer-request/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneDemandeClient(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('customer-request/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneDemandeClient should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneDemandeClient({} as any));
    expect(result.type).toBe('DemandeClient/Update/rejected');
    expect(result.payload).toBe('Échec de modification');
  });
});
