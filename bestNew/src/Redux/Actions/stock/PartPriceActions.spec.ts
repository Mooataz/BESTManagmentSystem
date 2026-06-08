import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getAllPartPrice, AddOnePartPrice, UpdateOnePartPrice } from './PartPriceActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('PartPriceActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getAllPartPrice should GET parts-price and return data', async () => {
    const mockData = [{ id: 1, price: 100 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllPartPrice());
    expect(API.get).toHaveBeenCalledWith('parts-price');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllPartPrice should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllPartPrice());
    expect(result.type).toBe('PartPrice/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddOnePartPrice should POST to parts-price and return data', async () => {
    const mockData = { id: 1, price: 100 };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOnePartPrice(mockData as any));
    expect(API.post).toHaveBeenCalledWith('parts-price', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOnePartPrice should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOnePartPrice({} as any));
    expect(result.type).toBe('PartPrice/AddPartPrice/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('UpdateOnePartPrice should PATCH to parts-price/{id} and return data', async () => {
    const mockData = { id: 1, price: 120 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOnePartPrice(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('parts-price/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOnePartPrice should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOnePartPrice({} as any));
    expect(result.type).toBe('PartPrice/UpdateOnePartPrice/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });
});
