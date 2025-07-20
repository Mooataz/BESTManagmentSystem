import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addHistoryRepair } from "../Actions/Reception/History";
import type { Device, FormHistoryRepair } from "../Types/repairTypes";
import { deviceHasOpenRepair } from "../Actions/Reception/DeviceActions";
interface StateHistory {
  devices: Device[];
  deviceOnRepair: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: StateHistory = {
  devices: [],
  deviceOnRepair: false,
  loading: false,
  success: false,
  error: null,
};
const DeviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(deviceHasOpenRepair.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deviceHasOpenRepair.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.success = true;
        state.deviceOnRepair=action.payload ; // Ajoute à l'historique
      })
      .addCase(deviceHasOpenRepair.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = DeviceSlice.actions;
export default DeviceSlice.reducer;