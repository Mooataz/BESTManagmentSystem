import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { AddOneStockPart, getAllStockPart } from './RemplissageStock';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('RemplissageStock', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('AddOneStockPart should POST to stock-parts and return data', async () => {
    const mockData = { id: 1, name: 'part' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneStockPart(mockData as any));
    expect(API.post).toHaveBeenCalledWith('stock-parts', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneStockPart should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneStockPart({} as any));
    expect(result.type).toBe('stockParts/AddOneStock-parts/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('addOneStockPart should reject with default on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('err'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneStockPart({} as any));
    expect(result.type).toBe('stockParts/AddOneStock-parts/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('getAllStockPart should GET stock-parts and return data', async () => {
    const mockData = [{ id: 1, name: 'part' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllStockPart());
    expect(API.get).toHaveBeenCalledWith('stock-parts');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllStockPart should reject with error message on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllStockPart());
    expect(result.type).toBe('stockParts/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération  ');
  });

  it('getAllStockPart should reject with default on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('err'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllStockPart());
    expect(result.type).toBe('stockParts/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération  ');
  });
});
