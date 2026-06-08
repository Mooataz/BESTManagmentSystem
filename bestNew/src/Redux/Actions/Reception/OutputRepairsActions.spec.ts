import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { addOutPut, GetOutPutBranch, GetOneOutPut } from './OutputRepairsActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('OutputRepairsActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('addOutPut should POST to output-list and return data', async () => {
    const mockData = { id: 1, name: 'output' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(addOutPut(mockData as any));
    expect(API.post).toHaveBeenCalledWith('output-list', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('addOutPut should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addOutPut({} as any));
    expect(result.type).toBe('OutputList/addOutPut/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('GetOutPutBranch should GET output-list/findByBranch/{id} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetOutPutBranch(1));
    expect(API.get).toHaveBeenCalledWith('output-list/findByBranch/1');
    expect(result.payload).toEqual(mockData);
  });

  it('GetOutPutBranch should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetOutPutBranch(1));
    expect(result.type).toBe('OutputList/GetOutPutBranch/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('GetOneOutPut should GET output-list/{id} and return data', async () => {
    const mockData = { id: 1, name: 'output' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetOneOutPut(1));
    expect(API.get).toHaveBeenCalledWith('output-list/1');
    expect(result.payload).toEqual(mockData);
  });

  it('GetOneOutPut should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetOneOutPut(1));
    expect(result.type).toBe('OutputList/GetOneOutPut/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });
});
