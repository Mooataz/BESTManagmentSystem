import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { AddFrais, GetAllFrais, UpdateFrais } from './AutresFraisActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('AutresFraisActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('AddFrais should POST to other-cost/ and return data', async () => {
    const mockData = { id: 1, name: 'Frais1' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddFrais(mockData as any));
    expect(API.post).toHaveBeenCalledWith('other-cost/', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddFrais should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddFrais({} as any));
    expect(result.type).toBe('OtherCost/add/rejected');
    expect(result.payload).toBe('Échec de création ');
  });

  it('GetAllFrais should GET other-cost and return data', async () => {
    const mockData = [{ id: 1, name: 'Frais1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetAllFrais());
    expect(API.get).toHaveBeenCalledWith('other-cost');
    expect(result.payload).toEqual(mockData);
  });

  it('GetAllFrais should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetAllFrais());
    expect(result.type).toBe('OtherCost/GetAll/rejected');
    expect(result.payload).toBe('Échec   ');
  });

  it('UpdateFrais should PATCH to other-cost/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateFrais(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('other-cost/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateFrais should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateFrais({} as any));
    expect(result.type).toBe('OtherCost/update/rejected');
    expect(result.payload).toBe('Échec   ');
  });
});
