import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import notesCustomerReducer, { clearError } from './NotesCustomerSlice';
import type { TypeUnique } from '../Types/repairTypes';

describe('NotesCustomerSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { NotesCustomer: notesCustomerReducer } });
  });

  it('should return initial state', () => {
    const state = store.getState().NotesCustomer;
    expect(state.notesCustomer).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.success).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle clearError', () => {
    store = configureStore({
      reducer: { NotesCustomer: notesCustomerReducer },
      preloadedState: {
        NotesCustomer: { notesCustomer: [], loading: false, success: false, error: 'some error' },
      },
    });
    store.dispatch(clearError());
    expect(store.getState().NotesCustomer.error).toBeNull();
  });

  it('should handle getNotesCustomer.pending', () => {
    store.dispatch({ type: 'NotesCustomer/getAll/pending' });
    expect(store.getState().NotesCustomer.loading).toBe(true);
  });

  it('should handle getNotesCustomer.fulfilled', () => {
    const payload: TypeUnique[] = [{ id: 1, name: 'Note A' }];
    store.dispatch({ type: 'NotesCustomer/getAll/fulfilled', payload });
    const state = store.getState().NotesCustomer;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.notesCustomer).toEqual(payload);
  });

  it('should handle getNotesCustomer.rejected', () => {
    store.dispatch({ type: 'NotesCustomer/getAll/rejected' });
    expect(store.getState().NotesCustomer.error).toBe('Erreur inconnue');
  });

  it('should handle AddOneNoteCustomer.pending', () => {
    store.dispatch({ type: 'NotesCustomer/add/pending' });
    expect(store.getState().NotesCustomer.loading).toBe(true);
  });

  it('should handle AddOneNoteCustomer.fulfilled', () => {
    const payload: TypeUnique = { id: 2, name: 'Nouvelle note' };
    store.dispatch({ type: 'NotesCustomer/add/fulfilled', payload });
    const state = store.getState().NotesCustomer;
    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.notesCustomer).toContainEqual(payload);
  });

  it('should handle AddOneNoteCustomer.rejected', () => {
    store.dispatch({ type: 'NotesCustomer/add/rejected', payload: 'Erreur' });
    expect(store.getState().NotesCustomer.error).toBe('Erreur');
  });

  it('should handle UpdateOneNoteCustomer.pending', () => {
    store.dispatch({ type: 'NotesCustomer/Update/pending' });
    expect(store.getState().NotesCustomer.loading).toBe(true);
  });

  it('should handle UpdateOneNoteCustomer.fulfilled', () => {
    const payload: TypeUnique = { id: 1, name: 'Mis à jour' };
    store.dispatch({ type: 'NotesCustomer/Update/fulfilled', payload });
    expect(store.getState().NotesCustomer.notesCustomer).toContainEqual(payload);
  });

  it('should handle UpdateOneNoteCustomer.rejected', () => {
    store.dispatch({ type: 'NotesCustomer/Update/rejected' });
    expect(store.getState().NotesCustomer.error).toBe('Erreur inconnue');
  });
});
