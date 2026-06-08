import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { addHistoryRepair } from './History';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('History', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('addHistoryRepair should POST to history-repair and return data', async () => {
    const mockData = { id: 1, action: 'test' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(addHistoryRepair(mockData as any));
    expect(API.post).toHaveBeenCalledWith('history-repair', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('addHistoryRepair should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addHistoryRepair({} as any));
    expect(result.type).toBe('historyReppair/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('addHistoryRepair should reject with default message', async () => {
    (API.post as any).mockRejectedValue(new Error('err'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addHistoryRepair({} as any));
    expect(result.type).toBe('historyReppair/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });
});
