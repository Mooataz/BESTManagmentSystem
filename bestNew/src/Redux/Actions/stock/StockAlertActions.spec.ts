import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getStockAlerts, markAlertRead } from './StockAlertActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('StockAlertActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getStockAlerts should GET apiApp/stock-alert/{branchId}/{userId} and return data', async () => {
    const mockData = [{ id: 1, message: 'Alert' }];
    (API.get as any).mockResolvedValue({ data: mockData });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getStockAlerts({ branchId: 1, userId: 2 }));
    expect(API.get).toHaveBeenCalledWith('apiApp/stock-alert/1/2');
    expect(result.payload).toEqual(mockData);
  });

  it('getStockAlerts should reject on failure', async () => {
    (API.get as any).mockRejectedValue({ response: { data: { message: 'Erreur' } } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getStockAlerts({ branchId: 1, userId: 2 }));
    expect(result.payload).toBe('Erreur');
  });

  it('markAlertRead should PATCH apiApp/stock-alert/{alertId}/read/{userId} and return data', async () => {
    const mockData = { id: 1, read: true };
    (API.patch as any).mockResolvedValue({ data: mockData });
    const store = configureStore({ reducer });
    const result = await store.dispatch(markAlertRead({ alertId: 1, userId: 2 }));
    expect(API.patch).toHaveBeenCalledWith('apiApp/stock-alert/1/read/2');
    expect(result.payload).toEqual(mockData);
  });

  it('markAlertRead should reject on failure', async () => {
    (API.patch as any).mockRejectedValue({ response: { data: { message: 'Erreur' } } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(markAlertRead({ alertId: 1, userId: 2 }));
    expect(result.payload).toBe('Erreur');
  });
});
