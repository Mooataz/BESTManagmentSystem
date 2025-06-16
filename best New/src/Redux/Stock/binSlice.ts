import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addBin, getBin } from '../Actions/stock/Bin';
import type { Bin } from '../Types/Stock';
//binSlice
interface BinState {
  bin: Bin[]; // Pour stocker plusieurs réparations
  currentBin: Bin | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: BinState = {
  bin: [],
  currentBin: null,
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
        state.currentBin = action.payload;
        //state.bin= action.payload;
        state.bin.push(action.payload);
       })
      .addCase(addBin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(getBin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getBin.fulfilled, (state, action: PayloadAction<Bin[]>) => {
        state.loading = false;
        state.success = true;
        state.bin = action.payload;
        state.currentBin = action.payload.length > 0 ? action.payload[0] : null;
      })
      
      
      .addCase(getBin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = addBinSlice.actions;
export default addBinSlice.reducer;