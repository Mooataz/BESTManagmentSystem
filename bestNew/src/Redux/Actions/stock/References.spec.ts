import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getReferences, getOneReference, getByMaterialCode, AddOneReference, UpdateOneReference } from './References';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('References', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getReferences should GET references and return data', async () => {
    const mockData = [{ id: 1, materialCode: 'REF1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getReferences());
    expect(API.get).toHaveBeenCalledWith('references');
    expect(result.payload).toEqual(mockData);
  });

  it('getReferences should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getReferences());
    expect(result.type).toBe('references/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération des bins');
  });

  it('getOneReference should GET references/{id} and return data', async () => {
    const mockData = { id: 1, materialCode: 'REF1' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneReference(1));
    expect(API.get).toHaveBeenCalledWith('references/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOneReference should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneReference(1));
    expect(result.type).toBe('references/getOne/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getByMaterialCode should GET references/GetMC/{MC} and return data', async () => {
    const mockData = { id: 1, materialCode: 'MC001' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getByMaterialCode('MC001'));
    expect(API.get).toHaveBeenCalledWith('references/GetMC/MC001');
    expect(result.payload).toEqual(mockData);
  });

  it('getByMaterialCode should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getByMaterialCode('MC001'));
    expect(result.type).toBe('references/getByMaterialCode/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddOneReference should POST to references and return data', async () => {
    const mockData = [{ id: 1, materialCode: 'REF1' }];
    const body = { materialCode: 'REF1', description: 'test' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneReference(body as any));
    expect(API.post).toHaveBeenCalledWith('references', body);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneReference should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneReference({} as any));
    expect(result.type).toBe('References/AddOneReference/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('UpdateOneReference should PATCH /references/{id} and return data', async () => {
    const mockData = { id: 1, materialCode: 'REF1' };
    (API.patch as any).mockResolvedValue({ data: mockData });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneReference({ id: 1, materialCode: 'REF1' }));
    expect(API.patch).toHaveBeenCalledWith('/references/1', { id: 1, materialCode: 'REF1' });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneReference should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('err'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneReference({ id: 1 }));
    expect(result.type).toBe('references/updateOne/rejected');
    expect(result.error.message).toBe('err');
  });
});
