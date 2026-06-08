import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getDistributers, getOneDistributer, AddOneDistributer, UpdateOneDistributer } from './Distributer';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Distributer', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getDistributers should GET distributeur and return data', async () => {
    const mockData = [{ id: 1, name: 'Dist1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getDistributers());
    expect(API.get).toHaveBeenCalledWith('distributeur');
    expect(result.payload).toEqual(mockData);
  });

  it('getDistributers should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getDistributers());
    expect(result.type).toBe('distributer/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getOneDistributer should GET distributeur/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Dist1' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneDistributer(1));
    expect(API.get).toHaveBeenCalledWith('distributeur/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOneDistributer should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneDistributer(1));
    expect(result.type).toBe('distributer/getOne/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddOneDistributer should POST to distributeur and return data', async () => {
    const mockData = { id: 1, name: 'NewDist' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneDistributer(mockData as any));
    expect(API.post).toHaveBeenCalledWith('distributeur', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneDistributer should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneDistributer({} as any));
    expect(result.type).toBe('distributer/AddOne/rejected');
    expect(result.payload).toBe("Échec de l'ajoute");
  });

  it('UpdateOneDistributer should PATCH to distributeur/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneDistributer({ id: 1, name: 'Updated' } as any));
    expect(API.patch).toHaveBeenCalledWith('distributeur/1', { id: 1, name: 'Updated' });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneDistributer should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneDistributer({} as any));
    expect(result.type).toBe('distributer/UpdateOne/rejected');
    expect(result.payload).toBe('Échec ');
  });
});
