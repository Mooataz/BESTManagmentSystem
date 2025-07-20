import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LevelRepairForm } from "../Types/administrationTypes";
import { AddLevelRepair, getLevelRepair, UpdateOnelevelRepair } from "../Actions/Administration/levelRepairActions";

interface LegislationState {
  levelRepair: LevelRepairForm[]; // Pour stocker plusieurs réparations
   loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: LegislationState = {
  levelRepair: [],
   loading: false,
  success: false,
  error: null,
};

const legislationSlice = createSlice({
  name: 'LevelRepair',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLevelRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getLevelRepair.fulfilled, (state, action: PayloadAction<LevelRepairForm[]>) => {
        state.loading = false;
        state.success = true;
         state.levelRepair=action.payload; // Ajoute à l'historique
      })
      .addCase(getLevelRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(AddLevelRepair.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddLevelRepair.fulfilled, (state, action: PayloadAction<LevelRepairForm>) => {
        state.loading = false;
        state.success = true;
         state.levelRepair.push(action.payload); // Ajoute à l'historique
      })
      .addCase(AddLevelRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
       .addCase(UpdateOnelevelRepair .pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateOnelevelRepair.fulfilled, (state, action: PayloadAction<LevelRepairForm>) => {
        state.loading = false;
        state.success = true;
         state.levelRepair.push(action.payload); // Ajoute à l'historique
      })
      .addCase(UpdateOnelevelRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = legislationSlice.actions;
export default legislationSlice.reducer;