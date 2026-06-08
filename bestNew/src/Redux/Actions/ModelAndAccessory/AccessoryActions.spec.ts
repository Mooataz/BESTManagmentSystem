import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { GetAllAccessory, UpdateAcesory, AddAcesory } from './AccessoryActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('ModelAndAccessory/AccessoryActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('GetAllAccessory should GET accessory and return data', async () => {
    const mockData = [{ id: 1, name: 'Acc1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetAllAccessory());
    expect(API.get).toHaveBeenCalledWith('accessory');
    expect(result.payload).toEqual(mockData);
  });

  it('GetAllAccessory should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetAllAccessory());
    expect(result.type).toBe('accessory/GetAll/rejected');
    expect(result.payload).toBe('Échec !');
  });

  it('UpdateAcesory should PATCH to accessory/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateAcesory(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('accessory/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateAcesory should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateAcesory({} as any));
    expect(result.type).toBe('accessory/Update/rejected');
    expect(result.payload).toBe('Échec !');
  });

  it('AddAcesory should POST to accessory and return data', async () => {
    const mockData = { id: 1, name: 'NewAcc' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddAcesory(mockData as any));
    expect(API.post).toHaveBeenCalledWith('accessory', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddAcesory should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddAcesory({} as any));
    expect(result.type).toBe('accessory/Add/rejected');
    expect(result.payload).toBe('Échec !');
  });
});
