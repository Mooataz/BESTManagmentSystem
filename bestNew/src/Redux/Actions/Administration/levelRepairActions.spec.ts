import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getLevelRepair, AddLevelRepair, UpdateOnelevelRepair } from './levelRepairActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('levelRepairActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getLevelRepair should GET level-repair and return data', async () => {
    const mockData = [{ id: 1, name: 'Level1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getLevelRepair());
    expect(API.get).toHaveBeenCalledWith('level-repair');
    expect(result.payload).toEqual(mockData);
  });

  it('getLevelRepair should return error string on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getLevelRepair());
    expect(result.payload).toBe('Échec de récupération ');
  });

  it('AddLevelRepair should POST to level-repair and return data', async () => {
    const mockData = { id: 1, name: 'New' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddLevelRepair(mockData as any));
    expect(API.post).toHaveBeenCalledWith('level-repair', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddLevelRepair should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddLevelRepair({} as any));
    expect(result.type).toBe('LevelRepair/AddOne/rejected');
    expect(result.payload).toBe("Échec de l'ajoute ");
  });

  it('UpdateOnelevelRepair should PATCH to level-repair/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOnelevelRepair(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('level-repair/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOnelevelRepair should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOnelevelRepair({} as any));
    expect(result.type).toBe('LevelRepair/UpdateOne/rejected');
    expect(result.payload).toBe('Échec de modification ');
  });
});
