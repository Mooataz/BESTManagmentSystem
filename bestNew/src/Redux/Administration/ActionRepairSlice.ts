import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TypeUnique } from "../Types/repairTypes";
import { AddRepairAction, getRepairAction, UpdateOneRepairAction } from "../Actions/Administration/ActionRepairActions";

interface IntState {
  repairAction: TypeUnique[]; // Pour stocker plusieurs réparations
  currentRepairAction: TypeUnique | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: IntState = {
  repairAction: [],
  currentRepairAction: null,
  loading: false,
  success: false,
  error: null,
};


const accessorySlice = createSlice({
  name: 'RepairAction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getRepairAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getRepairAction.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.repairAction=action.payload;  
      })
      .addCase(getRepairAction.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })

      .addCase(AddRepairAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddRepairAction.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.repairAction=action.payload;  
      })
      .addCase(AddRepairAction.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })

      .addCase(UpdateOneRepairAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateOneRepairAction.fulfilled, (state, action: PayloadAction<TypeUnique>) => {
        state.loading = false;
        state.success = true;
        state.repairAction.push(action.payload);  
      })
      .addCase(UpdateOneRepairAction.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError  } = accessorySlice.actions;
export default accessorySlice.reducer;