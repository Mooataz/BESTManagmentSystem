import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addRepair } from '../Actions/Reception/receptionAction';
import type {RepairForm} from '../Types/repairTypes'
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

const receptionSlice = createSlice({
  name: 'repair',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addRepair.fulfilled, (state, action: PayloadAction<RepairForm>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload;
        state.repairs.push(action.payload); // Ajoute à l'historique
      })
      .addCase(addRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = receptionSlice.actions;
export default receptionSlice.reducer;