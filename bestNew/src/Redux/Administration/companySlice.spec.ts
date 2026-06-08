import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import companyReducer, { clearError } from './companySlice';
import type { Company } from '../Types/administrationTypes';

describe('companySlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { company: companyReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().company;
    expect(state.company).toBeNull();
    expect(state.currentcompany).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { company: companyReducer },
      preloadedState: {
        company: { company: null, currentcompany: null, loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().company.error).toBeNull();
  });

  it('should handle getCompany.pending', () => {
    store.dispatch({ type: 'company/get/pending' });
    const state = store.getState().company;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle getCompany.fulfilled', () => {
    const company: Company = {
      id: 1,
      name: 'Best Corp',
      headquarterslocation: '123 Main St',
      taxRegisterNumber: 'T123456',
      rib: 987654,
      logo: 'logo.png',
      bank: 'National Bank',
      quantityAlertStock: 10,
      tva: 19,
      timbreFiscale: 1,
    };
    store.dispatch({ type: 'company/get/fulfilled', payload: company });
    const state = store.getState().company;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.company).toEqual(company);
  });

  it('should handle getCompany.rejected', () => {
    store.dispatch({ type: 'company/get/rejected', payload: 'Erreur réseau' });
    const state = store.getState().company;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Erreur réseau');
  });

  it('should handle getCompany.rejected with default error', () => {
    store.dispatch({ type: 'company/get/rejected' });
    expect(store.getState().company.error).toBe('Erreur inconnue');
  });

  it('should handle updateCompany.pending', () => {
    store.dispatch({ type: 'company/Update/pending' });
    const state = store.getState().company;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });

  it('should handle updateCompany.fulfilled', () => {
    const company: Company = {
      id: 1,
      name: 'Updated Corp',
      headquarterslocation: '456 Oak Ave',
      taxRegisterNumber: 'T654321',
      rib: 123456,
      logo: 'newlogo.png',
      bank: 'City Bank',
      quantityAlertStock: 20,
    };
    store.dispatch({ type: 'company/Update/fulfilled', payload: company });
    const state = store.getState().company;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.company).toEqual(company);
  });

  it('should handle updateCompany.rejected', () => {
    store.dispatch({ type: 'company/Update/rejected', payload: 'Mise à jour échouée' });
    const state = store.getState().company;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBe('Mise à jour échouée');
  });
});
