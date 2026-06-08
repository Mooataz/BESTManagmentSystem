import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { AddDevice, deviceHasOpenRepair, UpdateOneDevice } from './DeviceActions';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('DeviceActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('AddDevice should POST to devices/Device/ and return data', async () => {
    const mockData = { id: 1, serialenumber: 'SN001' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddDevice(mockData as any));
    expect(API.post).toHaveBeenCalledWith('devices/Device/', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddDevice should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddDevice({} as any));
    expect(result.type).toBe('repair/AddDevice/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });

  it('deviceHasOpenRepair should GET devices/deviceHasOpenRepair/{serial} and return data', async () => {
    (API.get as any).mockResolvedValue({ data: { data: true } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(deviceHasOpenRepair('SN001'));
    expect(API.get).toHaveBeenCalledWith('devices/deviceHasOpenRepair/SN001');
    expect(result.payload).toBe(true);
  });

  it('deviceHasOpenRepair should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(deviceHasOpenRepair('SN001'));
    expect(result.type).toBe('device/deviceHasOpenRepair/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });

  it('UpdateOneDevice should PATCH to devices/{id} and return data', async () => {
    const mockData = { id: 1, serialenumber: 'SN002' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneDevice({ id: 1, serialenumber: 'SN002' }));
    expect(API.patch).toHaveBeenCalledWith('devices/1', { serialenumber: 'SN002' });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneDevice should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneDevice({ id: 1 }));
    expect(result.type).toBe('device/update/rejected');
    expect(result.payload).toBe("Échec de l'envoi");
  });
});
