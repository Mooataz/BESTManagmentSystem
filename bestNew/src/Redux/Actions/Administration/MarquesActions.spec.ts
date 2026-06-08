import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getMarques, getAllMarques, AddOneMarque, UpdateOneMarque } from './MarquesActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('MarquesActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getMarques should GET brands/findAutoriser and return data', async () => {
    const mockData = [{ id: 1, name: 'Marque1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getMarques());
    expect(API.get).toHaveBeenCalledWith('brands/findAutoriser');
    expect(result.payload).toEqual(mockData);
  });

  it('getMarques should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getMarques());
    expect(result.type).toBe('brands/getAllAutoriser/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('getAllMarques should GET brands and return data', async () => {
    const mockData = [{ id: 1, name: 'Marque1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllMarques());
    expect(API.get).toHaveBeenCalledWith('brands');
    expect(result.payload).toEqual(mockData);
  });

  it('getAllMarques should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAllMarques());
    expect(result.type).toBe('brands/getAll/rejected');
    expect(result.payload).toBe('Échec de la récupération ');
  });

  it('AddOneMarque should POST to brands and return data', async () => {
    const mockData = [{ id: 1, name: 'New' }];
    const fd = new FormData();
    fd.append('name', 'New');
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneMarque(fd));
    expect(API.post).toHaveBeenCalledWith('brands', fd);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneMarque should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneMarque(new FormData()));
    expect(result.type).toBe('brands/Add/rejected');
    expect(result.payload).toBe("Échec de l'ajoute ");
  });

  it('UpdateOneMarque should PATCH to brands/{id} with multipart and return data', async () => {
    const mockData = [{ id: 1, name: 'Updated' }];
    const fd = new FormData();
    fd.append('name', 'Updated');
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneMarque({ id: 1, formData: fd }));
    expect(API.patch).toHaveBeenCalledWith('brands/1', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneMarque should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneMarque({ id: 1, formData: new FormData() }));
    expect(result.type).toBe('brands/Update/rejected');
    expect(result.payload).toBe('Échec de la mise à jour');
  });
});
