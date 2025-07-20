//ReceiveSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Customer, Device, RepairForm } from '../Types/repairTypes'
import { addRepair, AssignRepair, getByBranchStep, getByUserStep, getOneRepair, getRepairIncomplet, getRepairs, getRepairsByBranch } from '../Actions/Reception/repairAction';
import { AddDevice } from '../Actions/Reception/DeviceActions';
import { AddCustomer } from '../Actions/Reception/customerActions';

/* interface RepairState {
  repairs: RepairForm[];
  repBranchStep: RepairForm[];
  tempactuellybranch: number | null;
  tempCustomer: Customer | null;
  temDevice: Device | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}
 */
interface RepairState {
  repairs: RepairForm[];
  repBranchStep: RepairForm[];
  oneRepair: RepairForm | null;
  tempactuellybranch: number | null;
  tempCustomer: Customer | null;
  temDevice: Device | null;
  loading: boolean;
  success: boolean;
  error: string | null;
  // Ajoutez un champ pour la réparation en cours
  currentRepair: Partial<RepairForm> | null;
}
const initialState: RepairState = {
  repairs: [],
  repBranchStep: [],
  oneRepair: null,
  tempactuellybranch:null,
  tempCustomer: null,
  temDevice: null,
  loading: false,
  success: false,
  error: null,
  currentRepair :null,
};

const repairSlice = createSlice({
  name: `repair`,
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActuellyBranch: (state, action: PayloadAction<number>) => {
    state.tempactuellybranch = action.payload;
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
        state.repBranchStep = action.payload;
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
        state.repairs.push(action.payload);
        state.tempCustomer=null;
        state.temDevice=null;
        
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
        state.repairs = action.payload;

      })
      .addCase(getByUserStep.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      
      .addCase(AddCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.success = true;
        state.tempCustomer = action.payload;
        console.log('Repair slice- customer',state.tempCustomer)
      })
      .addCase(AddCustomer.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
     
      .addCase(AddDevice.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddDevice.fulfilled, (state, action: PayloadAction<Device>) => {
        state.loading = false;
        state.success = true;
        state.temDevice = action.payload;
        
        if (state.repairs.length > 0) {
          const lastRepair = state.repairs[state.repairs.length - 1];
          if (lastRepair && typeof lastRepair === 'object') {
            const updatedLastRepair = { ...lastRepair };
            updatedLastRepair.device = action.payload.id;
            state.repairs[state.repairs.length - 1] = updatedLastRepair;
          }
        }
      })
      .addCase(AddDevice.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })

      .addCase(getRepairIncomplet.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getRepairIncomplet.fulfilled, (state, action: PayloadAction<RepairForm[]>) => {
        state.loading = false;
        state.success = true;
        state.repairs = action.payload;
        
         
      })
      .addCase(getRepairIncomplet.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })

      .addCase(getOneRepair.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getOneRepair.fulfilled, (state, action: PayloadAction<RepairForm>) => {
        state.loading = false;
        state.success = true;
        state.oneRepair = action.payload;
        
       })
      .addCase(getOneRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      ;

  },
});

export const { clearError, setActuellyBranch } = repairSlice.actions;
export default repairSlice.reducer;