import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OutputListForm } from "../Types/repairTypes";
import { addOutPut, GetOneOutPut, GetOutPutBranch } from "../Actions/Reception/OutputRepairsActions";

interface StateOut {
  out: OutputListForm[];
  Oneout: OutputListForm |  null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: StateOut = {
  out: [],
  Oneout:  null,
  loading: false,
  success: false,
  error: null,
};
const HistoryRepairSlice = createSlice({
  name: 'OutputList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOutPut.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addOutPut.fulfilled, (state, action: PayloadAction<OutputListForm>) => {
        state.loading = false;
        state.success = true;
        state.out.push(action.payload); // Ajoute à l'historique
      })
      .addCase(addOutPut.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })

      .addCase(GetOutPutBranch.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(GetOutPutBranch.fulfilled, (state, action: PayloadAction<OutputListForm[]>) => {
        state.loading = false;
        state.success = true;
        state.out = action.payload; // Ajoute à l'historique
      })
      .addCase(GetOutPutBranch.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(GetOneOutPut.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(GetOneOutPut.fulfilled, (state, action: PayloadAction<OutputListForm>) => {
        state.loading = false;
        state.success = true;
        state.Oneout = action.payload; // Ajoute à l'historique
      })
      .addCase(GetOneOutPut.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = HistoryRepairSlice.actions;
export default HistoryRepairSlice.reducer;