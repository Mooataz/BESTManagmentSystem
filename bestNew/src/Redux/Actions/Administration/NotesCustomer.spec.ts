import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { API } from '../../../services/api';
import { getNotesCustomer, AddOneNoteCustomer, UpdateOneNoteCustomer } from './NotesCustomer';

vi.mock('../../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

const reducer = (state = {}) => state;

describe('NotesCustomer', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('getNotesCustomer should GET notes-customer and return data', async () => {
    const mockData = [{ id: 1, note: 'Note1' }];
    (API.get as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(getNotesCustomer());
    expect(API.get).toHaveBeenCalledWith('notes-customer');
    expect(result.payload).toEqual(mockData);
  });

  it('getNotesCustomer should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Erreur'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(getNotesCustomer());
    expect(result.type).toBe('NotesCustomer/getAll/rejected');
    expect(result.error.message).toBe('Erreur');
  });

  it('AddOneNoteCustomer should POST to notes-customer/ and return data', async () => {
    const mockData = { id: 1, note: 'New note' };
    (API.post as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneNoteCustomer(mockData as any));
    expect(API.post).toHaveBeenCalledWith('notes-customer/', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('AddOneNoteCustomer should reject on failure', async () => {
    (API.post as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(AddOneNoteCustomer({} as any));
    expect(result.type).toBe('NotesCustomer/add/rejected');
    expect(result.payload).toBe('Échec de création ');
  });

  it('UpdateOneNoteCustomer should PATCH to notes-customer/{id} and return data', async () => {
    const mockData = { id: 1, note: 'Updated' };
    (API.patch as any).mockResolvedValue({ data: { data: mockData } });
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneNoteCustomer(mockData as any));
    expect(API.patch).toHaveBeenCalledWith('notes-customer/1', mockData);
    expect(result.payload).toEqual(mockData);
  });

  it('UpdateOneNoteCustomer should reject on failure', async () => {
    (API.patch as any).mockRejectedValue(new Error('Network Error'));
    const store = configureStore({ reducer });
    const result = await store.dispatch(UpdateOneNoteCustomer({} as any));
    expect(result.type).toBe('NotesCustomer/Update/rejected');
    expect(result.payload).toBe('Échec de modification');
  });
});
