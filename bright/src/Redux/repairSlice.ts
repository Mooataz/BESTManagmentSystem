import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addRepair } from './Actions/repairAction';
 
interface RepairState {
  repair: any | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}
const initialState:RepairState  = {
  repair: null,
  loading: false,
  success: false,
  error: null,
};


const authSlice = createSlice({
  name: 'repair',
  initialState,
  reducers: {
    // Définition corrigée avec la syntaxe action creator
    
clearError: (state: RepairState) => {
  state.error = null;
}


  },
  extraReducers: (builder) => {
    builder
      .addCase(addRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRepair.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.repair = action.payload;
         
      })
      .addCase(addRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Unknown error';
      })
       
  },
});

export const { clearError } = authSlice.actions;
 
export default repairSlice.reducer;
