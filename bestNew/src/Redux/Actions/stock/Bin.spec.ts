import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { addBin, updateBin, getBin, findByBinName, findByBranchType } from './Bin';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Bin', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('addBin should POST to bin and return data', async () => {
    const mockData = { id: 1, name: 'Bin1' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(addBin({ name: 'Bin1', branch: 1 }));
    expect(API.post).toHaveBeenCalledWith('bin', { name: 'Bin1', branch: 1 });
    expect(result.payload).toEqual(mockData);
  });

  it('addBin should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addBin({ name: 'Bin1', branch: 1 }));
    expect(result.type).toBe('bin/AddOneBin/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('updateBin should PATCH to bin/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Bin1' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateBin({ id: 1, name: 'Bin1', branch: 1 }));
    expect(API.patch).toHaveBeenCalledWith('bin/1', { id: 1, name: 'Bin1', branch: 1 });
    expect(result.payload).toEqual(mockData);
  });

  it('updateBin should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateBin({ id: 1, name: 'Bin1', branch: 1 }));
    expect(result.type).toBe('bin/update/rejected');
    expect(result.payload).toBe('Échec de la récupération des bins');
  });

  it('getBin should GET bin/find/{branchId} and return data', async () => {
    const mockData = [{ id: 1, name: 'Bin1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getBin(1));
    expect(API.get).toHaveBeenCalledWith('bin/find/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getBin should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getBin(1));
    expect(result.type).toBe('bin/getByBranch/rejected');
    expect(result.payload).toBe('Échec de la récupération des bins');
  });

  it('findByBinName should GET bin/findName/{name} and return data', async () => {
    const mockData = { id: 1, name: 'Bin1' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(findByBinName('Bin1'));
    expect(API.get).toHaveBeenCalledWith('bin/findName/Bin1');
    expect(result.payload).toEqual(mockData);
  });

  it('findByBinName should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(findByBinName('Bin1'));
    expect(result.type).toBe('bin/getBinByName/rejected');
    expect(result.payload).toBe('Échec de la récupération  ');
  });

  it('findByBranchType should GET bin/find/{id}/{type} and return data', async () => {
    const mockData = [{ id: 1, name: 'Bin1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(findByBranchType({ id: 1, type: 'storage' }));
    expect(API.get).toHaveBeenCalledWith('bin/find/1/storage');
    expect(result.payload).toEqual(mockData);
  });

  it('findByBranchType should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(findByBranchType({ id: 1, type: 'storage' }));
    expect(result.type).toBe('bin/getBinBranchType/rejected');
    expect(result.payload).toBe('Échec de la récupération  ');
  });
});
