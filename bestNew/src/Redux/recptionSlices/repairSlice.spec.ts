import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { clearError, setActuellyBranch } from './repairSlice';

describe('repairSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { repair: reducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().repair;
    expect(state.repairs).toEqual([]);
    expect(state.repBranchStep).toEqual([]);
    expect(state.oneRepair).toBeNull();
    expect(state.tempactuellybranch).toBeNull();
    expect(state.tempCustomer).toBeNull();
    expect(state.temDevice).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
    expect(state.currentRepair).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { repair: reducer },
      preloadedState: {
        repair: { repairs: [], repBranchStep: [], oneRepair: null, tempactuellybranch: null, tempCustomer: null, temDevice: null, loading: false, success: false, error: 'err', currentRepair: null },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().repair.error).toBeNull();
  });

  it('should handle setActuellyBranch', () => {
    store.dispatch(setActuellyBranch(5));
    expect(store.getState().repair.tempactuellybranch).toBe(5);
  });

  it('should handle addRepair.pending', () => {
    store.dispatch({ type: 'repair/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle addRepair.fulfilled', () => {
    const repair = { id: 1, device: 1, customer: 1, actuellybranch: 1 };
    store.dispatch({ type: 'repair/fulfilled', payload: repair });
    const state = store.getState().repair;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.repairs).toContainEqual(repair);
    expect(state.tempCustomer).toBeNull();
    expect(state.temDevice).toBeNull();
  });

  it('should handle addRepair.rejected', () => {
    store.dispatch({ type: 'repair/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle addRepair.rejected with default error', () => {
    store.dispatch({ type: 'repair/rejected' });
    expect(store.getState().repair.error).toBe('Erreur inconnue');
  });

  it('should handle getRepairs.pending', () => {
    store.dispatch({ type: 'repair/getAll/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle getRepairs.fulfilled', () => {
    const repairs = [{ id: 1 }];
    store.dispatch({ type: 'repair/getAll/fulfilled', payload: repairs });
    expect(store.getState().repair.repairs).toEqual(repairs);
  });

  it('should handle getRepairs.rejected', () => {
    store.dispatch({ type: 'repair/getAll/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle getRepairsByBranch.pending', () => {
    store.dispatch({ type: 'repair/getByBranch/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle getRepairsByBranch.fulfilled', () => {
    const repairs = [{ id: 2, branch: 1 }];
    store.dispatch({ type: 'repair/getByBranch/fulfilled', payload: repairs });
    expect(store.getState().repair.repairs).toEqual(repairs);
  });

  it('should handle getRepairsByBranch.rejected', () => {
    store.dispatch({ type: 'repair/getByBranch/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle getByBranchStep.pending', () => {
    store.dispatch({ type: 'repair/byBranchAndStep/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle getByBranchStep.fulfilled', () => {
    const repairs = [{ id: 3, step: 'step1' }];
    store.dispatch({ type: 'repair/byBranchAndStep/fulfilled', payload: repairs });
    expect(store.getState().repair.repBranchStep).toEqual(repairs);
  });

  it('should handle getByBranchStep.rejected', () => {
    store.dispatch({ type: 'repair/byBranchAndStep/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle AssignRepair.pending', () => {
    store.dispatch({ type: 'repair/AssignTechRepair/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle AssignRepair.fulfilled', () => {
    const repair = { id: 4, user: 1 };
    store.dispatch({ type: 'repair/AssignTechRepair/fulfilled', payload: repair });
    expect(store.getState().repair.repairs).toContainEqual(repair);
  });

  it('should handle AssignRepair.rejected', () => {
    store.dispatch({ type: 'repair/AssignTechRepair/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle getByUserStep.pending', () => {
    store.dispatch({ type: 'repair/FilterByUserStep/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle getByUserStep.fulfilled', () => {
    const repairs = [{ id: 5, user: 1 }];
    store.dispatch({ type: 'repair/FilterByUserStep/fulfilled', payload: repairs });
    expect(store.getState().repair.repairs).toEqual(repairs);
  });

  it('should handle getByUserStep.rejected', () => {
    store.dispatch({ type: 'repair/FilterByUserStep/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle AddCustomer.pending', () => {
    store.dispatch({ type: 'repair/AddCustomer/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle AddCustomer.fulfilled', () => {
    const customer = { id: 1, name: 'Client' };
    store.dispatch({ type: 'repair/AddCustomer/fulfilled', payload: customer });
    expect(store.getState().repair.tempCustomer).toEqual(customer);
  });

  it('should handle AddCustomer.rejected', () => {
    store.dispatch({ type: 'repair/AddCustomer/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle AddDevice.pending', () => {
    store.dispatch({ type: 'repair/AddDevice/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle AddDevice.fulfilled', () => {
    const device = { id: 1, serialenumber: 'SN001' };
    store.dispatch({ type: 'repair/AddDevice/fulfilled', payload: device });
    expect(store.getState().repair.temDevice).toEqual(device);
  });

  it('should handle AddDevice.fulfilled updates last repair device field', () => {
    const existingRepair = { id: 1, device: 0, customer: 1, actuellybranch: 1 };
    store = configureStore({
      reducer: { repair: reducer },
      preloadedState: {
        repair: { repairs: [existingRepair], repBranchStep: [], oneRepair: null, tempactuellybranch: null, tempCustomer: null, temDevice: null, loading: false, success: false, error: null, currentRepair: null },
      },
    });
    const device = { id: 5, serialenumber: 'SN005' };
    store.dispatch({ type: 'repair/AddDevice/fulfilled', payload: device });
    expect(store.getState().repair.repairs[0].device).toBe(5);
  });

  it('should handle AddDevice.rejected', () => {
    store.dispatch({ type: 'repair/AddDevice/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle getRepairIncomplet.pending', () => {
    store.dispatch({ type: 'repair/findRepairIncomplet/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle getRepairIncomplet.fulfilled', () => {
    const repairs = [{ id: 6, incomplet: true }];
    store.dispatch({ type: 'repair/findRepairIncomplet/fulfilled', payload: repairs });
    expect(store.getState().repair.repairs).toEqual(repairs);
  });

  it('should handle getRepairIncomplet.rejected', () => {
    store.dispatch({ type: 'repair/findRepairIncomplet/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle getOneRepair.pending', () => {
    store.dispatch({ type: 'repair/findOneRepair/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle getOneRepair.fulfilled', () => {
    const repair = { id: 7, device: 1 };
    store.dispatch({ type: 'repair/findOneRepair/fulfilled', payload: repair });
    expect(store.getState().repair.oneRepair).toEqual(repair);
  });

  it('should handle getOneRepair.rejected', () => {
    store.dispatch({ type: 'repair/findOneRepair/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle UpdateOneRepair.pending', () => {
    store.dispatch({ type: 'repair/Update/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle UpdateOneRepair.fulfilled', () => {
    const repair = { id: 8, state: 'done' };
    store.dispatch({ type: 'repair/Update/fulfilled', payload: repair });
    expect(store.getState().repair.oneRepair).toEqual(repair);
  });

  it('should handle UpdateOneRepair.rejected', () => {
    store.dispatch({ type: 'repair/Update/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle UpdatePartFileRepair.pending', () => {
    store.dispatch({ type: 'repair/updateWithPartsFiles/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle UpdatePartFileRepair.fulfilled', () => {
    const payload = { data: { id: 9, files: ['f1.pdf'] } };
    store.dispatch({ type: 'repair/updateWithPartsFiles/fulfilled', payload });
    expect(store.getState().repair.oneRepair).toEqual(payload.data);
  });

  it('should handle UpdatePartFileRepair.fulfilled without data', () => {
    store.dispatch({ type: 'repair/updateWithPartsFiles/fulfilled', payload: {} });
    expect(store.getState().repair.oneRepair).toBeNull();
  });

  it('should handle UpdatePartFileRepair.rejected', () => {
    store.dispatch({ type: 'repair/updateWithPartsFiles/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle DeleteRepairFile.pending', () => {
    store.dispatch({ type: 'repair/deleteFile/pending' });
    expect(store.getState().repair.loading).toBe(true);
  });

  it('should handle DeleteRepairFile.fulfilled', () => {
    const existingRepair = { id: 10, files: ['f1.pdf', 'f2.pdf'], device: 1, customer: 1, actuellybranch: 1 };
    store = configureStore({
      reducer: { repair: reducer },
      preloadedState: {
        repair: { repairs: [], repBranchStep: [], oneRepair: existingRepair, tempactuellybranch: null, tempCustomer: null, temDevice: null, loading: false, success: false, error: null, currentRepair: null },
      },
    });
    store.dispatch({ type: 'repair/deleteFile/fulfilled', payload: { id: 10, files: ['f2.pdf'] } });
    expect(store.getState().repair.oneRepair?.files).toEqual(['f2.pdf']);
  });

  it('should handle DeleteRepairFile.fulfilled when oneRepair id mismatches', () => {
    store = configureStore({
      reducer: { repair: reducer },
      preloadedState: {
        repair: { repairs: [], repBranchStep: [], oneRepair: { id: 99, files: ['x.pdf'], device: 1, customer: 1, actuellybranch: 1 }, tempactuellybranch: null, tempCustomer: null, temDevice: null, loading: false, success: false, error: null, currentRepair: null },
      },
    });
    store.dispatch({ type: 'repair/deleteFile/fulfilled', payload: { id: 10, files: ['y.pdf'] } });
    expect(store.getState().repair.oneRepair?.files).toEqual(['x.pdf']);
  });

  it('should handle DeleteRepairFile.rejected', () => {
    store.dispatch({ type: 'repair/deleteFile/rejected', payload: 'Err' });
    expect(store.getState().repair.error).toBe('Err');
  });

  it('should handle rejected with default error for repair', () => {
    store.dispatch({ type: 'repair/getAll/rejected' });
    expect(store.getState().repair.error).toBe('Erreur inconnue');
  });
});
