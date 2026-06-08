import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../services/api';
import { AssignTech } from './Coordinate';

vi.mock('../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('Coordinate', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('AssignTech should POST to users/userAssign/ and return data', async () => {
    const mockData = [{ id: 1, login: 'tech' }];
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AssignTech({ branchId: 1, admin: true }));
    expect(API.post).toHaveBeenCalledWith('users/userAssign/', { branchId: 1, admin: true });
    expect(result.payload).toEqual(mockData);
  });

  it('AssignTech should reject with error message on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AssignTech({ branchId: 1, admin: true }));
    expect(result.type).toBe('users/userAssign/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });

  it('AssignTech should reject with default message when no response data', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AssignTech({ branchId: 1, admin: true }));
    expect(result.type).toBe('users/userAssign/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });
});
