import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addBin, findByBinName, findByBranchType, getBin } from '../Actions/stock/Bin';
import type { Bin } from '../Types/Stock';
//binSlice
interface BinState {
  bin: Bin[]; // Pour stocker plusieurs réparations
  BinByName: Bin | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: BinState = {
  bin: [],
  BinByName: null,
  loading: false,
  success: false,
  error: null,
};

const addBinSlice = createSlice({
  name: 'bin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addBin.fulfilled, (state, action: PayloadAction<Bin>) => {
        state.loading = false;
        state.success = true;
         
        state.bin.push(action.payload);
       })
      .addCase(addBin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(getBin.pending, (state) => { findByBinName
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getBin.fulfilled, (state, action: PayloadAction<Bin[]>) => {
        state.loading = false;
        state.success = true;
        state.bin = action.payload;
       })
      
      
      .addCase(getBin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(findByBinName.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(findByBinName.fulfilled, (state, action: PayloadAction<Bin>) => {
        state.loading = false;
        state.success = true;
        state.BinByName = action.payload;
       })
      
      
      .addCase(findByBinName.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(findByBranchType.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(findByBranchType.fulfilled, (state, action: PayloadAction<Bin[]>) => {
        state.loading = false;
        state.success = true;
        state.bin = action.payload;
       })
      
      
      .addCase(findByBranchType.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = addBinSlice.actions;
export default addBinSlice.reducer;