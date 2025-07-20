import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Agency } from '../Types/Stock';
import { getAgencies } from '../Actions/Administration/Agencies';
import { getAccessory } from '../Actions/Administration/AccessoryActions';
import type { Accessory } from '../Types/repairTypes';

interface AccessoryState {
  accessory: Accessory[]; // Pour stocker plusieurs réparations
  currentallAccessory: Agency | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AccessoryState = {
  accessory: [],
  currentallAccessory: null,
  loading: false,
  success: false,
  error: null,
};


const accessorySlice = createSlice({
  name: 'accessory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getAccessory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAccessory.fulfilled, (state, action: PayloadAction<Accessory[]>) => {
        state.loading = false;
        state.success = true;
        state.accessory=action.payload;  
      })
      .addCase(getAccessory.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError  } = accessorySlice.actions;
export default accessorySlice.reducer;