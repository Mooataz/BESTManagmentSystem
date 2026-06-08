import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getAllStockPartBranch, getTotransfert, getOnePart, AddhistoryOnePart } from './EtatStockActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('EtatStockActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getAllStockPartBranch should GET stock-parts/findBranch/{id} and return data', async () => {
    const mockData = [{ id: 1, qty: 10 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllStockPartBranch(1));
    expect(API.get).toHaveBeenCalledWith('stock-parts/findBranch/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllStockPartBranch should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllStockPartBranch(1));
    expect(result.type).toBe('stockPart/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getTotransfert should GET stock-parts/find/{typePart}/{branchId} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getTotransfert({ typePart: 'typeA', branchId: 1 }));
    expect(API.get).toHaveBeenCalledWith('stock-parts/find/typeA/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getTotransfert should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getTotransfert({ typePart: 'typeA', branchId: 1 }));
    expect(result.type).toBe('stockParts/getTotransfert/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('getOnePart should GET stock-parts/{id} and return data', async () => {
    const mockData = { id: 1, qty: 10 };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOnePart(1));
    expect(API.get).toHaveBeenCalledWith('stock-parts/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOnePart should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOnePart(1));
    expect(result.type).toBe('stockPart/getOnePart/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddhistoryOnePart should POST to AddHistorytockPart/{id}/{userId}/{step} and return data', async () => {
    const mockData = { id: 1 };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddhistoryOnePart({ id: 1, userId: 2, step: 'step1' }));
    expect(API.post).toHaveBeenCalledWith('AddHistorytockPart/1/2/step1');
    expect(result.payload).toEqual(mockData);
  });

  it('AddhistoryOnePart should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddhistoryOnePart({ id: 1, userId: 2, step: 'step1' }));
    expect(result.type).toBe('stockPart/AddhistoryOnePart/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });
});
