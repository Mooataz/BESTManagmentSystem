import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getListFault, AddListFault, UpdateListFault } from './ListFaultActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('ListFaultActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getListFault should GET list-fault and return data', async () => {
    const mockData = [{ id: 1, name: 'Fault1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getListFault());
    expect(API.get).toHaveBeenCalledWith('list-fault');
    expect(result.payload).toEqual(mockData);
  });

  it('getListFault should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getListFault());
    expect(result.type).toBe('listfault/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('AddListFault should POST to list-fault with JSON headers and return data', async () => {
    const mockData = [{ id: 1, name: 'New' }];
    const body = { name: 'New' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddListFault(body as any));
    expect(API.post).toHaveBeenCalledWith('list-fault', body, { headers: { 'Content-Type': 'application/json' } });
    expect(result.payload).toEqual(mockData);
  });

  it('AddListFault should throw on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddListFault({} as any));
    expect(result.type).toBe('listfault/Add/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('UpdateListFault should PATCH to list-fault/{id} and return data', async () => {
    const mockData = [{ id: 1, name: 'Updated' }];
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateListFault({ id: 1, name: 'Updated' } as any));
    expect(API.patch).toHaveBeenCalledWith('list-fault/1', { id: 1, name: 'Updated' });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateListFault should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateListFault({} as any));
    expect(result.type).toBe('listfault/update/rejected');
    expect(result.payload).toBe('Échec de la mise à jour');
  });
});
