import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Agency } from '../Types/Stock';
import type { TypeUnique } from '../Types/repairTypes';
import { AddListFault, getListFault, UpdateListFault } from '../Actions/Administration/ListFaultActions';

interface ListFaultState {
  listFault: TypeUnique[]; // Pour stocker plusieurs réparations
  // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ListFaultState = {
  listFault: [],

  loading: false,
  success: false,
  error: null,
};


const listFaulSlice = createSlice({
  name: 'listfault',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder

      .addCase(getListFault.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getListFault.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.listFault = action.payload;
      })
      .addCase(getListFault.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(AddListFault.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddListFault.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.listFault = action.payload;
      })
      .addCase(AddListFault.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(UpdateListFault.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateListFault.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        // Mise à jour de l'élément dans le tableau
        state.listFault = action.payload  
      })
      .addCase(UpdateListFault.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError } = listFaulSlice.actions;
export default listFaulSlice.reducer;