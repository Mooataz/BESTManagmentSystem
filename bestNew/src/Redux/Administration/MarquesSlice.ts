import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Marque } from "../Types/repairTypes";
import {   AddOneMarque, getAllMarques, getMarques, UpdateOneMarque } from "../Actions/Administration/MarquesActions";

interface MarqueState {
  Marque: Marque[]; // Pour stocker plusieurs réparations
  currentallMarque: Marque | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: MarqueState = {
  Marque: [],
  currentallMarque: null,
  loading: false,
  success: false,
  error: null,
};


const MarquesSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getMarques.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getMarques.fulfilled, (state, action: PayloadAction<Marque[]>) => {
        state.loading = false;
        state.success = true;
        state.Marque=action.payload;  
      })
      .addCase(getMarques.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';  
      })
       .addCase(getAllMarques.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllMarques.fulfilled, (state, action: PayloadAction<Marque[]>) => {
        state.loading = false;
        state.success = true;
        state.Marque=action.payload;  
      })
      .addCase(getAllMarques.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue'; //
      })
      .addCase(AddOneMarque.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddOneMarque.fulfilled, (state, action: PayloadAction<Marque[]>) => {
        state.loading = false;
        state.success = true;
        state.Marque=action.payload;  
      })
      .addCase(AddOneMarque.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue'; //
      })
      .addCase(UpdateOneMarque.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateOneMarque.fulfilled, (state, action: PayloadAction<Marque[]>) => {
        state.loading = false;
        state.success = true;
        state.Marque=action.payload;  
      })
      .addCase(UpdateOneMarque.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue'; //
      })
      ;
  },
});

export const { clearError  } = MarquesSlice.actions;
export default MarquesSlice.reducer;