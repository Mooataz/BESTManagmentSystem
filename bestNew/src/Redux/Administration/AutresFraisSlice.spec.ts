import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import autresFraisReducer, { clearError } from './AutresFraisSlice';
import type { FormLisFrais } from '../Types/administrationTypes';

describe('AutresFraisSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { OtherCost: autresFraisReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().OtherCost;
    expect(state.autresFrais).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { OtherCost: autresFraisReducer },
      preloadedState: {
        OtherCost: { autresFrais: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().OtherCost.error).toBeNull();
  });

  it('should handle AddFrais.pending', () => {
    store.dispatch({ type: 'OtherCost/add/pending' });
    expect(store.getState().OtherCost.loading).toBe(true);
  });

  it('should handle AddFrais.fulfilled', () => {
    const payload: FormLisFrais = { id: 1, price: 50, name: 'Frais test', status: 'active' };
    store.dispatch({ type: 'OtherCost/add/fulfilled', payload });
    const state = store.getState().OtherCost;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.autresFrais).toContainEqual(payload);
  });

  it('should handle AddFrais.rejected', () => {
    store.dispatch({ type: 'OtherCost/add/rejected' });
    expect(store.getState().OtherCost.error).toBe('Erreur inconnue');
  });

  it('should handle GetAllFrais.pending', () => {
    store.dispatch({ type: 'OtherCost/GetAll/pending' });
    expect(store.getState().OtherCost.loading).toBe(true);
  });

  it('should handle GetAllFrais.fulfilled', () => {
    const payload: FormLisFrais[] = [{ id: 1, price: 100, name: 'Frais A', status: 'active' }];
    store.dispatch({ type: 'OtherCost/GetAll/fulfilled', payload });
    expect(store.getState().OtherCost.autresFrais).toEqual(payload);
  });

  it('should handle GetAllFrais.rejected', () => {
    store.dispatch({ type: 'OtherCost/GetAll/rejected', payload: 'Erreur réseau' });
    expect(store.getState().OtherCost.error).toBe('Erreur réseau');
  });

  it('should handle UpdateFrais.pending', () => {
    store.dispatch({ type: 'OtherCost/update/pending' });
    expect(store.getState().OtherCost.loading).toBe(true);
  });

  it('should handle UpdateFrais.fulfilled', () => {
    const payload: FormLisFrais = { id: 1, price: 200, name: 'Mis à jour', status: 'inactive' };
    store.dispatch({ type: 'OtherCost/update/fulfilled', payload });
    expect(store.getState().OtherCost.autresFrais).toContainEqual(payload);
  });

  it('should handle UpdateFrais.rejected', () => {
    store.dispatch({ type: 'OtherCost/update/rejected' });
    expect(store.getState().OtherCost.error).toBe('Erreur inconnue');
  });
});
