//ReceiveSlice.ts
import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
 import type {RepairForm} from '../Types/repairTypes'
import { addRepair, AssignRepair, getByBranchStep, getByUserStep, getRepairs, getRepairsByBranch } from '../Actions/Reception/repairAction';
  
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

const repairSlice = createSlice({
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
      .addCase(getRepairs.fulfilled, (state, action: PayloadAction<RepairForm[]>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload.length > 0 ? action.payload[0] : null;
        //state.repairs.push(action.payload); // Ajoute à l'historique
        state.repairs = action.payload;
      })
      .addCase(getRepairs.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })
      .addCase(getRepairsByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getRepairsByBranch.fulfilled, (state, action: PayloadAction<RepairForm[]>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload.length > 0 ? action.payload[0] : null;
        state.repairs = action.payload;
      })
      .addCase(getRepairsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })
         .addCase(getByBranchStep.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getByBranchStep.fulfilled, (state, action: PayloadAction<RepairForm[]>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload.length > 0 ? action.payload[0] : null;
        state.repairs = action.payload;
      })
      .addCase(getByBranchStep.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })
      .addCase(addRepair.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
        })
      .addCase(addRepair.fulfilled, (state, action: PayloadAction<RepairForm>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload;
        state.repairs.push(action.payload);   
         })
      .addCase(addRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
        })
        .addCase(AssignRepair.pending, (state) => { //getByUserStep
        state.loading = true;
        state.error = null;
        state.success = false;
        })
      .addCase(AssignRepair.fulfilled, (state, action: PayloadAction<RepairForm>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload;
        state.repairs.push(action.payload);   
        
         })
      .addCase(AssignRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
        })
       .addCase(getByUserStep.pending, (state) => { //getByUserStep
        state.loading = true;
        state.error = null;
        state.success = false;
        })
      .addCase(getByUserStep.fulfilled, (state, action: PayloadAction<RepairForm[]>) => {
        state.loading = false;
        state.success = true;
        state.currentRepair = action.payload.length > 0 ? action.payload[0] : null;
        state.repairs = action.payload;  
        
         })
      .addCase(getByUserStep.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
        })
      ;

  },
});

export const { clearError  } = repairSlice.actions;
export default repairSlice.reducer;