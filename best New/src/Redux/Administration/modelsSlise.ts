import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getModelsAuthorised } from "../Actions/Administration/Models";
import type { Model } from "../Types/repairTypes";

 
interface ModelState {
  models: Model[]; // Pour stocker plusieurs réparations
  currentmodels: Model | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ModelState = {
  models: [],
  currentmodels: null,
  loading: false,
  success: false,
  error: null,
};

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(getModelsAuthorised.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getModelsAuthorised.fulfilled, (state, action: PayloadAction<Model[]>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.models = action.payload; // Ajoute à l'historique
      })
      .addCase(getModelsAuthorised.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = modelsSlice.actions;
export default modelsSlice.reducer;