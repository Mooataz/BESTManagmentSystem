import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getAccessory } from './AccessoryActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Administration/AccessoryActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getAccessory should GET accessory and return data', async () => {
    const mockData = [{ id: 1, name: 'Acc1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAccessory());
    expect(API.get).toHaveBeenCalledWith('accessory');
    expect(result.payload).toEqual(mockData);
  });

  it('getAccessory should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAccessory());
    expect(result.type).toBe('accessory/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });
});
