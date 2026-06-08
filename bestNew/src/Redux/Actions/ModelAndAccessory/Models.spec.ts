import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getModelsAuthorised, getOneModel, getAllModel, UpdateModel, UpdatePictureModel, AddModel } from './Models';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Models', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getModelsAuthorised should GET models/findByBrandAuthorised and return data', async () => {
    const mockData = [{ id: 1, name: 'Model1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getModelsAuthorised());
    expect(API.get).toHaveBeenCalledWith('models/findByBrandAuthorised');
    expect(result.payload).toEqual(mockData);
  });

  it('getModelsAuthorised should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getModelsAuthorised());
    expect(result.type).toBe('models/findByBrandAuthorised/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getOneModel should GET models/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Model1' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneModel(1));
    expect(API.get).toHaveBeenCalledWith('models/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOneModel should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneModel(1));
    expect(result.type).toBe('models/OneModel/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getAllModel should GET models and return data', async () => {
    const mockData = [{ id: 1, name: 'Model1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllModel());
    expect(API.get).toHaveBeenCalledWith('models');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllModel should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllModel());
    expect(result.type).toBe('models/GetAllModel/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('UpdateModel should PATCH to models/{id} with multipart and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const fd = new FormData();
    fd.append('name', 'Updated');
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateModel({ id: 1 } as any));
    expect(API.patch).toHaveBeenCalledWith('models/1', { id: 1 }, { headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateModel should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateModel({ id: 1 } as any));
    expect(result.type).toBe('models/UpdateModel/rejected');
    expect(result.payload).toBe('Échec   ');
  });

  it('UpdatePictureModel should PATCH to models/{id} with formData', async () => {
    const mockData = { id: 1 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const fd = new FormData();
    fd.append('id', '1');
    fd.append('picture', 'data');
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdatePictureModel(fd));
    expect(API.patch).toHaveBeenCalledWith('models/1', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdatePictureModel should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const fd = new FormData();
    fd.append('id', '1');
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdatePictureModel(fd));
    expect(result.type).toBe('models/UpdateModel/rejected');
    expect(result.payload).toBe('Échec');
  });

  it('AddModel should POST to models with multipart and return data', async () => {
    const mockData = { id: 1, name: 'New' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const fd = new FormData();
    fd.append('name', 'New');
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddModel(fd));
    expect(API.post).toHaveBeenCalledWith('models', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result.payload).toEqual(mockData);
  });

  it('AddModel should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddModel(new FormData()));
    expect(result.type).toBe('models/AddModel/rejected');
    expect(result.payload).toBe('Échec');
  });
});
