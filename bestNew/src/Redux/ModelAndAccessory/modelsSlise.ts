import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AddModel, getAllModel, getModelsAuthorised, getOneModel, UpdateModel } from "../Actions/ModelAndAccessory/Models";
import type { Model } from "../Types/repairTypes";
 
 
interface ModelState {
  models: Model[]; // Pour stocker plusieurs réparations
  Onemodel:Model | null
  currentmodels: Model | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
  
}

const initialState: ModelState = {
  models: [],
  Onemodel: null,
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
      .addCase(getOneModel.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getOneModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.Onemodel = action.payload; // Ajoute à l'historique
      })
      .addCase(getOneModel.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(getAllModel.pending, (state) => {   
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllModel.fulfilled, (state, action: PayloadAction<Model[]>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.models = action.payload; // Ajoute à l'historique
      })
      .addCase(getAllModel.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(UpdateModel.pending, (state) => {    
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.models.push(action.payload); // Ajoute à l'historique
      })
      .addCase(UpdateModel.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(AddModel.pending, (state) => {     
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddModel.fulfilled, (state, action: PayloadAction<Model>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.models.push(action.payload); // Ajoute à l'historique
      })
      .addCase(AddModel.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = modelsSlice.actions;
export default modelsSlice.reducer;