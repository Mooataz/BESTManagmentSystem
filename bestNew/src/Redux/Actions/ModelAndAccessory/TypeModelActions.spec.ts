import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { GetAllTypeModel, UpdateTypeModel, AjoutTypeModel } from './TypeModelActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('TypeModelActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('GetAllTypeModel should GET type-model and return data', async () => {
    const mockData = [{ id: 1, name: 'Type1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetAllTypeModel());
    expect(API.get).toHaveBeenCalledWith('type-model');
    expect(result.payload).toEqual(mockData);
  });

  it('GetAllTypeModel should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetAllTypeModel());
    expect(result.type).toBe('TypeModel/GetAll/rejected');
    expect(result.payload).toBe('Échec !');
  });

  it('UpdateTypeModel should PATCH to type-model/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateTypeModel(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('type-model/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateTypeModel should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateTypeModel({} as any));
    expect(result.type).toBe('TypeModel/Update/rejected');
    expect(result.payload).toBe('Échec !');
  });

  it('AjoutTypeModel should POST to type-model and return data', async () => {
    const mockData = { id: 1, name: 'NewType' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AjoutTypeModel(mockData as any));
    expect(API.post).toHaveBeenCalledWith('type-model', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AjoutTypeModel should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AjoutTypeModel({} as any));
    expect(result.type).toBe('TypeModel/ADD/rejected');
    expect(result.payload).toBe('Échec !');
  });
});
