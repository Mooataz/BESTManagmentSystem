import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Distributor } from "../Types/repairTypes";
import { AddOneDistributer, getDistributers, getOneDistributer, UpdateOneDistributer } from "../Actions/Administration/Distributer";




interface DistributerState {
  distributer: Distributor[];
  oneDistributer: Distributor | null; // Pour stocker plusieurs réparations
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: DistributerState = {
  distributer: [],
  oneDistributer: null,
  loading: false,
  success: false,
  error: null,
};

const distributerSlice = createSlice({
  name: 'distributer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire getOneDistributer
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDistributers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(getDistributers.fulfilled, (state, action) => {
        state.distributer = action.payload; // ✅ on remplace, pas on accumule
      })

      .addCase(getDistributers.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';

      })
      .addCase(getOneDistributer.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(getOneDistributer.fulfilled, (state, action: PayloadAction<Distributor>) => {
        state.loading = false;
        state.success = true;
        state.oneDistributer = action.payload;
      })

      .addCase(getOneDistributer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';

      })
      .addCase(UpdateOneDistributer.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(UpdateOneDistributer.fulfilled, (state, action: PayloadAction<Distributor>) => {
        state.loading = false;
        state.success = true;
        state.distributer.push(action.payload) ;
      })

      .addCase(UpdateOneDistributer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';

      })
      .addCase(AddOneDistributer.pending, (state) => {   
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(AddOneDistributer.fulfilled, (state, action: PayloadAction<Distributor>) => {
        state.loading = false;
        state.success = true;
        state.distributer.push( action.payload);
      })

      .addCase(AddOneDistributer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';

      });
  },
});

export const { clearError } = distributerSlice.actions;
export default distributerSlice.reducer;