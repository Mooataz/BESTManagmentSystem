import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TypeUnique } from "../Types/repairTypes";
import { AddOneNoteCustomer, getNotesCustomer, UpdateOneNoteCustomer } from "../Actions/Administration/NotesCustomer";

interface TypeState {
  notesCustomer: TypeUnique[]; // Pour stocker plusieurs réparations
   loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: TypeState = {
  notesCustomer: [],
   loading: false,
  success: false,
  error: null,
};


const NotesCustomerSlice = createSlice({
  name: 'NotesCustomer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getNotesCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getNotesCustomer.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.notesCustomer=action.payload;  
      })
      .addCase(getNotesCustomer.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(AddOneNoteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddOneNoteCustomer.fulfilled, (state, action: PayloadAction<TypeUnique>) => {
        state.loading = false;
        state.success = true;
        state.notesCustomer.push(action.payload);  
      })
      .addCase(AddOneNoteCustomer.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(UpdateOneNoteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateOneNoteCustomer.fulfilled, (state, action: PayloadAction<TypeUnique>) => {
        state.loading = false;
        state.success = true;
        state.notesCustomer.push(action.payload);  
      })
      .addCase(UpdateOneNoteCustomer.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = NotesCustomerSlice.actions;
export default NotesCustomerSlice.reducer;