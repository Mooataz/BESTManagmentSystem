import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PartPriceForm } from "../Types/Stock";
import { AddOnePartPrice,  getAllPartPrice } from "../Actions/stock/PartPriceActions";

interface BinState {
  PartPrice: PartPriceForm[]; // Pour stocker plusieurs réparations
    // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: BinState = {
  PartPrice: [],
   loading: false,
  success: false,
  error: null,
};

const PartPriceSlice = createSlice({
  name: 'PartPrice',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPartPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllPartPrice.fulfilled, (state, action: PayloadAction<PartPriceForm[]>) => {
        state.loading = false;
        state.success = true; 
        state.PartPrice= action.payload;
       })
      .addCase(getAllPartPrice.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue'; 
      })

       .addCase(AddOnePartPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddOnePartPrice.fulfilled, (state, action: PayloadAction<PartPriceForm>) => {
        state.loading = false;
        state.success = true; 
        state.PartPrice.push(action.payload);
       })
      .addCase(AddOnePartPrice.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';  
      })
      
      
      
      
     
      ;
  },
});

export const { clearError  } = PartPriceSlice.actions;
export default PartPriceSlice.reducer;