import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addHistoryRepair } from "../Actions/Reception/History";
import type { FormHistoryRepair } from "../Types/repairTypes";
interface StateHistory {
  insertHistory: FormHistoryRepair[];
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: StateHistory = {
  insertHistory: [],
  loading: false,
  success: false,
  error: null,
};
const HistoryRepairSlice = createSlice({
  name: 'historyRepair',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(addHistoryRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addHistoryRepair.fulfilled, (state, action: PayloadAction<FormHistoryRepair>) => {
        state.loading = false;
        state.success = true;
        state.insertHistory.push(action.payload); // Ajoute à l'historique
      })
      .addCase(addHistoryRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = HistoryRepairSlice.actions;
export default HistoryRepairSlice.reducer;