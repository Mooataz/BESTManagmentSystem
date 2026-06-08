import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getAgencies, addAgencies, updateAgencie } from './AgenciesActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('AgenciesActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getAgencies should GET branches and return data', async () => {
    const mockData = [{ id: 1, name: 'Agency1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAgencies());
    expect(API.get).toHaveBeenCalledWith('branches');
    expect(result.payload).toEqual(mockData);
  });

  it('getAgencies should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAgencies());
    expect(result.type).toBe('branches/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('addAgencies should POST to branches/ and return data', async () => {
    const mockData = { id: 1, name: 'NewAgency' };
    const body = { name: 'NewAgency', email: 'a@b.com', location: 'here', phone: 123, company: 1 };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(addAgencies(body));
    expect(API.post).toHaveBeenCalledWith('branches/', body);
    expect(result.payload).toEqual(mockData);
  });

  it('addAgencies should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addAgencies({} as any));
    expect(result.type).toBe('agencies/add/rejected');
    expect(result.payload).toBe('Échec de création de l\u2019agence');
  });

  it('updateAgencie should PATCH to branches/{id} and return data', async () => {
    const mockData = { id: 1, name: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateAgencie(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('branches/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('updateAgencie should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateAgencie({} as any));
    expect(result.type).toBe('branches/add/rejected');
    expect(result.payload).toBe('Échec de création ');
  });
});
