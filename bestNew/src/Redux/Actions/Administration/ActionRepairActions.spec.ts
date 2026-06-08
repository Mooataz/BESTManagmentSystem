import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getRepairAction, AddRepairAction, UpdateOneRepairAction } from './ActionRepairActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('ActionRepairActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getRepairAction should GET repair-action and return data', async () => {
    const mockData = [{ id: 1, name: 'Action1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairAction());
    expect(API.get).toHaveBeenCalledWith('repair-action');
    expect(result.payload).toEqual(mockData);
  });

  it('getRepairAction should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairAction());
    expect(result.type).toBe('RepairAction/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('AddRepairAction should POST to repair-action and return data', async () => {
    const mockData = [{ id: 1, name: 'New' }];
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddRepairAction({ name: 'New' } as any));
    expect(API.post).toHaveBeenCalledWith('repair-action', { name: 'New' });
    expect(result.payload).toEqual(mockData);
  });

  it('AddRepairAction should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddRepairAction({} as any));
    expect(result.type).toBe('RepairAction/AddRepairAction/rejected');
    expect(result.payload).toBe('Échec de création ');
  });

  it('UpdateOneRepairAction should PATCH to repair-action/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneRepairAction(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('repair-action/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneRepairAction should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneRepairAction({} as any));
    expect(result.type).toBe('RepairAction/UpdateOneRepairAction/rejected');
    expect(result.payload).toBe('Échec de création ');
  });
});
