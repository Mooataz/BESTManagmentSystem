import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { AddOneTransfert, UpdateOneTransfert, GetSendTransfert, GetReceiveTransfert, FetchRepairTransfers, AcceptRepairTransfer, RefuseRepairTransfer, CancelRepairTransfer } from './TransfertAction';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('TransfertAction', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('AddOneTransfert should POST to transfert and return data', async () => {
    const mockData = { id: 1, state: 'pending' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneTransfert(mockData as any));
    expect(API.post).toHaveBeenCalledWith('transfert', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneTransfert should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneTransfert({} as any));
    expect(result.type).toBe('Transfert/AddOne/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('AddOneTransfert should reject with default on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('err'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneTransfert({} as any));
    expect(result.type).toBe('Transfert/AddOne/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('UpdateOneTransfert should PATCH to transfert/{id} and return data', async () => {
    const mockData = { id: 1, state: 'received', receivedDate: '2024-01-01', receiveUser: 2 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneTransfert(mockData));
    expect(API.patch).toHaveBeenCalledWith('transfert/1', { state: 'received', receivedDate: '2024-01-01', receiveUser: 2 });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneTransfert should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneTransfert({ id: 1 }));
    expect(result.type).toBe('Transfert/UpdateOne/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('GetSendTransfert should GET transfert/findFromBranchId/{branchId}/{type} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetSendTransfert({ branchId: 1, type: 'typeA' }));
    expect(API.get).toHaveBeenCalledWith('transfert/findFromBranchId/1/typeA');
    expect(result.payload).toEqual(mockData);
  });

  it('GetSendTransfert should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetSendTransfert({ branchId: 1, type: 'typeA' }));
    expect(result.type).toBe('Transfert/GetSendTransfert/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('GetReceiveTransfert should GET transfert/findToBranchId/{branchId}/{type}/{state} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetReceiveTransfert({ branchId: 1, type: 'typeA', state: 'pending' }));
    expect(API.get).toHaveBeenCalledWith('transfert/findToBranchId/1/typeA/pending');
    expect(result.payload).toEqual(mockData);
  });

  it('GetReceiveTransfert should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(GetReceiveTransfert({ branchId: 1, type: 'typeA', state: 'pending' }));
    expect(result.type).toBe('Transfert/GetReceiveTransfert/rejected');
    expect(result.payload).toBe("Échec de l'envoie");
  });

  it('FetchRepairTransfers should GET transfert/repair/branch/{id} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(FetchRepairTransfers(1));
    expect(API.get).toHaveBeenCalledWith('transfert/repair/branch/1');
    expect(result.payload).toEqual(mockData);
  });

  it('FetchRepairTransfers should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(FetchRepairTransfers(1));
    expect(result.type).toBe('Transfert/FetchRepairTransfers/rejected');
    expect(result.payload).toBe('Échec du chargement');
  });

  it('AcceptRepairTransfer should PATCH to transfert/repair/{id}/accept and return data', async () => {
    const mockData = { id: 1 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AcceptRepairTransfer({ id: 1, userId: 2 }));
    expect(API.patch).toHaveBeenCalledWith('transfert/repair/1/accept', { userId: 2 });
    expect(result.payload).toEqual(mockData);
  });

  it('AcceptRepairTransfer should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AcceptRepairTransfer({ id: 1, userId: 2 }));
    expect(result.type).toBe('Transfert/AcceptRepairTransfer/rejected');
    expect(result.payload).toBe("Échec de l'acceptation");
  });

  it('RefuseRepairTransfer should PATCH to transfert/repair/{id}/refuse and return data', async () => {
    const mockData = { id: 1 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(RefuseRepairTransfer({ id: 1, userId: 2 }));
    expect(API.patch).toHaveBeenCalledWith('transfert/repair/1/refuse', { userId: 2 });
    expect(result.payload).toEqual(mockData);
  });

  it('RefuseRepairTransfer should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(RefuseRepairTransfer({ id: 1, userId: 2 }));
    expect(result.type).toBe('Transfert/RefuseRepairTransfer/rejected');
    expect(result.payload).toBe('Échec du refus');
  });

  it('CancelRepairTransfer should PATCH to transfert/repair/{id}/cancel and return data', async () => {
    const mockData = { id: 1 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(CancelRepairTransfer({ id: 1, userId: 2 }));
    expect(API.patch).toHaveBeenCalledWith('transfert/repair/1/cancel', { userId: 2 });
    expect(result.payload).toEqual(mockData);
  });

  it('CancelRepairTransfer should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(CancelRepairTransfer({ id: 1, userId: 2 }));
    expect(result.type).toBe('Transfert/CancelRepairTransfer/rejected');
    expect(result.payload).toBe("Échec de l'annulation");
  });
});
