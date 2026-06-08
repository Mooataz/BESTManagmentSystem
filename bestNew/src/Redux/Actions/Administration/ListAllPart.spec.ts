import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getAllPart, getOnePart, AddOnePart, UpdateOnePart } from './ListAllPart';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('ListAllPart', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getAllPart should GET all-parts and return data', async () => {
    const mockData = [{ id: 1, description: 'Part1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllPart());
    expect(API.get).toHaveBeenCalledWith('all-parts');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllPart should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllPart());
    expect(result.type).toBe('allParts/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getOnePart should GET all-parts/{id} and return data', async () => {
    const mockData = { id: 1, description: 'Part1' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOnePart(1));
    expect(API.get).toHaveBeenCalledWith('all-parts/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOnePart should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOnePart(1));
    expect(result.type).toBe('allParts/getOne/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddOnePart should POST to all-parts/ and return data', async () => {
    const mockData = { id: 1, description: 'New' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOnePart(mockData as any));
    expect(API.post).toHaveBeenCalledWith('all-parts/', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOnePart should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOnePart({} as any));
    expect(result.type).toBe('allParts/add/rejected');
    expect(result.payload).toBe('Échec de création ');
  });

  it('UpdateOnePart should PATCH to all-parts/{id} and return data', async () => {
    const mockData = { id: 1, description: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOnePart(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('all-parts/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOnePart should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOnePart({} as any));
    expect(result.type).toBe('allParts/Update/rejected');
    expect(result.payload).toBe('Échec de modification');
  });
});
