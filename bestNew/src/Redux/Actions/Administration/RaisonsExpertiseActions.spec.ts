import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getAllExpertiseRaisons, AddOneRaisons, UpdateOneRaison, GetOneRaison } from './RaisonsExpertiseActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('RaisonsExpertiseActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getAllExpertiseRaisons should GET expertise-reasons and return data', async () => {
    const mockData = [{ id: 1, name: 'Raison1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllExpertiseRaisons());
    expect(API.get).toHaveBeenCalledWith('expertise-reasons');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllExpertiseRaisons should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllExpertiseRaisons());
    expect(result.type).toBe('expertiseReasons/GetAll/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddOneRaisons should POST to expertise-reasons and return data', async () => {
    const mockData = [{ id: 1, name: 'Raison1' }];
    const body = { name: 'Raison1' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneRaisons(body as any));
    expect(API.post).toHaveBeenCalledWith('expertise-reasons', body, { headers: { 'Content-Type': 'application/json' } });
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneRaisons should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneRaisons({} as any));
    expect(result.type).toBe('expertiseReasons/Add/rejected');
    expect(result.payload).toBe("Échec de l'ajoute ");
  });

  it('UpdateOneRaison should PATCH to expertise-reasons/{id} and return data', async () => {
    const mockData = [{ id: 1, name: 'Updated' }];
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneRaison({ id: 1, name: 'Updated' } as any));
    expect(API.patch).toHaveBeenCalledWith('expertise-reasons/1', { id: 1, name: 'Updated' });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneRaison should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneRaison({} as any));
    expect(result.type).toBe('expertiseReasons/Update/rejected');
    expect(result.payload).toBe('Échec de la mise à jour');
  });

  it('GetOneRaison should GET expertise-reasons/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Raison1' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetOneRaison(1));
    expect(API.get).toHaveBeenCalledWith('expertise-reasons/1');
    expect(result.payload).toEqual(mockData);
  });

  it('GetOneRaison should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetOneRaison(1));
    expect(result.type).toBe('expertiseReasons/GetOneRaison/rejected');
    expect(result.payload).toBe('Échec rècuperation');
  });
});
