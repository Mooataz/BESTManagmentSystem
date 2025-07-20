import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TypeUnique } from "../Types/repairTypes";
import { AddDemandeClient, getDemandeClient,  UpdateOneDemandeClient,    } from "../Actions/Administration/DemandeClient";
 
interface CustomerRequestState {
  demandeClient: TypeUnique[]; // Pour stocker plusieurs réparations
   loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: CustomerRequestState = {
  demandeClient: [],
   loading: false,
  success: false,
  error: null,
};


const DemandeClientSlice = createSlice({
  name: 'DemandeClient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getDemandeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getDemandeClient.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.demandeClient=action.payload;  
      })
      .addCase(getDemandeClient.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(AddDemandeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddDemandeClient.fulfilled, (state, action: PayloadAction<TypeUnique>) => {
        state.loading = false;
        state.success = true;
        state.demandeClient.push(action.payload);  
      })
      .addCase(AddDemandeClient.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(UpdateOneDemandeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateOneDemandeClient.fulfilled, (state, action: PayloadAction<TypeUnique>) => {
        state.loading = false;
        state.success = true;
        state.demandeClient.push(action.payload);  
      })
      .addCase(UpdateOneDemandeClient.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = DemandeClientSlice.actions;
export default DemandeClientSlice.reducer;