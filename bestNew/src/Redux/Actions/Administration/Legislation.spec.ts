import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { addLegislation, getLegislations, UpdateLegislations } from './Legislation';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Legislation', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('addLegislation should POST to legislation and return data', async () => {
    const mockData = { id: 1, name: 'Law1' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(addLegislation(mockData as any));
    expect(API.post).toHaveBeenCalledWith('legislation', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('addLegislation should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addLegislation({} as any));
    expect(result.type).toBe('legislation/add/rejected');
    expect(result.payload).toBe('Échec de création ');
  });

  it('getLegislations should GET legislation and return data', async () => {
    const mockData = [{ id: 1, name: 'Law1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getLegislations());
    expect(API.get).toHaveBeenCalledWith('legislation');
    expect(result.payload).toEqual(mockData);
  });

  it('getLegislations should return error string on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getLegislations());
    expect(result.payload).toBe('Échec de récupération ');
  });

  it('UpdateLegislations should PATCH to legislation/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateLegislations(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('legislation/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateLegislations should return error string on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateLegislations({} as any));
    expect(result.payload).toBe('Échec de modification ');
  });
});
