import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Device } from "../Types/repairTypes";
import { AddDevice } from "../Actions/Reception/DeviceActions";

interface DeviceState {
  device: Device[]; // Pour stocker plusieurs réparations
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  device: [],
  loading: false,
  success: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'Device',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      
    .addCase(AddDevice.fulfilled, (state, action: PayloadAction<Device >) => {
         state.loading = false;
         state.success = true;
         state.device = [action.payload] ; // spread car c’est un tableau
        })

      .addCase(AddDevice.rejected, (state, action   ) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = customerSlice.actions;
export default customerSlice.reducer;