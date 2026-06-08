import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { addRepair, getRepairs, getRepairsByBranch, getByBranchStep, AssignRepair, getByUserStep, getRepairIncomplet, getOneRepair, UpdateOneRepair, DeleteRepairFile, UpdatePartFileRepair, getApproveStockByBranch, updateApproveStockState, getAvailableParts, confirmApprovePart } from './repairAction';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('repairAction', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('addRepair should POST to repair and return data', async () => {
    const mockData = { id: 1, device: 'phone' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(addRepair(mockData as any));
    expect(API.post).toHaveBeenCalledWith('repair', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('addRepair should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(addRepair({} as any));
    expect(result.type).toBe('repair/rejected');
    expect(result.payload).toBe('Échec de création de la réparation');
  });

  it('getRepairs should GET repair and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairs());
    expect(API.get).toHaveBeenCalledWith('repair');
    expect(result.payload).toEqual(mockData);
  });

  it('getRepairs should return error string on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairs());
    expect(result.payload).toBe('Échec de récupération de les réparations');
  });

  it('getRepairsByBranch should GET repair/findByActuellyBranch/{id} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairsByBranch(1));
    expect(API.get).toHaveBeenCalledWith('repair/findByActuellyBranch/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getRepairsByBranch should return error string on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairsByBranch(1));
    expect(result.payload).toBe('Échec de récupération de les réparations');
  });

  it('getByBranchStep should GET repair/byBranchAndStep with params and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getByBranchStep({ branch: 1, step: 'step1' }));
    expect(API.get).toHaveBeenCalledWith('repair/byBranchAndStep?branchId=1&step=step1');
    expect(result.payload).toEqual(mockData);
  });

  it('getByBranchStep should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getByBranchStep({ branch: 1, step: 'step1' }));
    expect(result.type).toBe('repair/byBranchAndStep/rejected');
    expect(result.payload).toBe('Échec de récupération de les réparations');
  });

  it('AssignRepair should PATCH to repair/{id} and return data', async () => {
    const mockData = { id: 1, user: 2 };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AssignRepair({ id: 1, user: 2 }));
    expect(API.patch).toHaveBeenCalledWith('repair/1', { id: 1, user: 2 });
    expect(result.payload).toEqual(mockData);
  });

  it('AssignRepair should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AssignRepair({ id: 1, user: 2 }));
    expect(result.type).toBe('repair/AssignTechRepair/rejected');
    expect(result.payload).toBe('Échec de récupération de les réparations');
  });

  it('getByUserStep should GET repair/FilterUserStep/{branchId}/{steps} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getByUserStep({ userId: 1, branchId: 2, step: 'step1' }));
    expect(API.get).toHaveBeenCalledWith('repair/FilterUserStep/2/step1');
    expect(result.payload).toEqual(mockData);
  });

  it('getByUserStep should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getByUserStep({ userId: 1, branchId: 2, step: 'step1' }));
    expect(result.type).toBe('repair/FilterByUserStep/rejected');
    expect(result.payload).toBe('Erreur de récupération');
  });

  it('getRepairIncomplet should GET repair/findRepairIncomplet/{data} and return data', async () => {
    const mockData = [{ id: 1 }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairIncomplet('test'));
    expect(API.get).toHaveBeenCalledWith('repair/findRepairIncomplet/test');
    expect(result.payload).toEqual(mockData);
  });

  it('getRepairIncomplet should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getRepairIncomplet('test'));
    expect(result.type).toBe('repair/findRepairIncomplet/rejected');
    expect(result.payload).toBe('Échec de récupération  ');
  });

  it('getOneRepair should GET repair/{id} and return data', async () => {
    const mockData = { id: 1, device: 'phone' };
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneRepair(1));
    expect(API.get).toHaveBeenCalledWith('repair/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getOneRepair should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getOneRepair(1));
    expect(result.type).toBe('repair/findOneRepair/rejected');
    expect(result.payload).toBe('Échec de récupération  ');
  });

  it('UpdateOneRepair should PATCH to repair/{id} and return data', async () => {
    const mockData = { id: 1, device: 'phone' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneRepair({ id: 1, device: 'tablet' }));
    expect(API.patch).toHaveBeenCalledWith('repair/1', { device: 'tablet' });
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneRepair should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneRepair({ id: 1 }));
    expect(result.type).toBe('repair/Update/rejected');
    expect(result.payload).toBe('Échec de récupération  ');
  });

  it('DeleteRepairFile should DELETE to repair/{id}/files/{fileName} and return data', async () => {
    const mockResponse = { data: { data: { files: ['file1'] } } };
    (API.delete as any).mockResolvedValue(mockResponse);
    const store = configureStore({ reducer });
    const result = await store.dispatch(DeleteRepairFile({ id: 1, fileName: 'test.pdf' }));
    expect(API.delete).toHaveBeenCalledWith('repair/1/files/test.pdf');
    expect(result.payload).toEqual({ id: 1, files: ['file1'] });
  });

  it('DeleteRepairFile should reject on failure', async () => {
    (API.delete as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(DeleteRepairFile({ id: 1, fileName: 'test.pdf' }));
    expect(result.type).toBe('repair/deleteFile/rejected');
    expect(result.payload).toBe('Erreur suppression fichier');
  });

  it('UpdatePartFileRepair should PATCH to repair/updateWithPartsFiles/{id} with multipart', async () => {
    const mockData = { success: true };
    (API.patch as any).mockResolvedValue({ data: mockData });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdatePartFileRepair({ id: 1, data: new FormData() }));
    expect(API.patch).toHaveBeenCalledWith(
      '/repair/updateWithPartsFiles/1',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    expect(result.payload).toEqual(mockData);
  });

  it('UpdatePartFileRepair should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdatePartFileRepair({ id: 1, data: new FormData() }));
    expect(result.type).toBe('repair/updateWithPartsFiles/rejected');
    expect(result.payload).toBe('Erreur lors de la mise à jour (fichiers)');
  });

  it('getApproveStockByBranch should GET approve-stock/findByBranch/{id} and return data', async () => {
    const mockData = [{ id: 1, state: 'pending' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getApproveStockByBranch(1));
    expect(API.get).toHaveBeenCalledWith('approve-stock/findByBranch/1');
    expect(result.payload).toEqual(mockData);
  });

  it('getApproveStockByBranch should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getApproveStockByBranch(1));
    expect(result.type).toBe('approveStock/getByBranch/rejected');
    expect(result.payload).toBe('Erreur de récupération');
  });

  it('updateApproveStockState should PATCH to approve-stock/{id} and return data', async () => {
    const mockData = { id: 1, state: 'approved' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateApproveStockState({ id: 1, state: 'approved' }));
    expect(API.patch).toHaveBeenCalledWith('approve-stock/1', { state: 'approved' });
    expect(result.payload).toEqual(mockData);
  });

  it('updateApproveStockState should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(updateApproveStockState({ id: 1, state: 'approved' }));
    expect(result.type).toBe('approveStock/updateState/rejected');
    expect(result.payload).toBe('Erreur de mise à jour');
  });

  it('getAvailableParts should GET approve-stock/{id}/available-parts with params', async () => {
    const mockData = [{ id: 1, serialnumber: 'SN001' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAvailableParts({ approveStockId: 1, branchId: 2 }));
    expect(API.get).toHaveBeenCalledWith('approve-stock/1/available-parts', { params: { branchId: 2 } });
    expect(result.payload).toEqual(mockData);
  });

  it('getAvailableParts should reject on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getAvailableParts({ approveStockId: 1, branchId: 2 }));
    expect(result.type).toBe('approveStock/getAvailableParts/rejected');
    expect(result.payload).toBe('Erreur de récupération des pièces disponibles');
  });

  it('confirmApprovePart should POST to approve-stock/{id}/confirm-part and return data', async () => {
    const mockData = { id: 1, state: 'confirmed' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(confirmApprovePart({ approveStockId: 1, stockPartId: 2, binDefectId: 3, userId: 4 }));
    expect(API.post).toHaveBeenCalledWith('approve-stock/1/confirm-part', { stockPartId: 2, binDefectId: 3, userId: 4 });
    expect(result.payload).toEqual(mockData);
  });

  it('confirmApprovePart should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(confirmApprovePart({ approveStockId: 1, stockPartId: 2, binDefectId: 3, userId: 4 }));
    expect(result.type).toBe('approveStock/confirmPart/rejected');
    expect(result.payload).toBe('Erreur de confirmation de pièce');
  });
});
