import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
 import type {RepairForm} from '../Types/repairTypes'
import { getRepairs } from '../Actions/Reception/receptionAction';
// repairSlice.ts
interface RepairState {
  repairs: RepairForm[]; // Pour stocker plusieurs réparations
  currentRepair: RepairForm | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: RepairState = {
  repairs: [],
  currentRepair: null,
  loading: false,
  success: false,
  error: null,
};

const receiveRepairSlice = createSlice({
  name: `repair`,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRepairs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getRepairs.fulfilled, (state, action: PayloadAction<RepairForm>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload;
        state.repairs.push(action.payload); // Ajoute à l'historique
      })
      .addCase(getRepairs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        });

  },
});

export const { clearError  } = receiveRepairSlice.actions;
export default receiveRepairSlice.reducer;