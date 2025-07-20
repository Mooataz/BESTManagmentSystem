import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AddAcesory, GetAllAccessory, UpdateAcesory } from "../Actions/ModelAndAccessory/AccessoryActions";
import type { TypeUnique } from "../Types/repairTypes";

interface BinState {
  accessory: TypeUnique[]; // Pour stocker plusieurs réparations
    // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: BinState = {
  accessory: [],
   
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
      .addCase(GetAllAccessory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(GetAllAccessory.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
         
        state.accessory=action.payload;
       })
      .addCase(GetAllAccessory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
       .addCase(UpdateAcesory.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateAcesory.fulfilled, (state, action: PayloadAction<TypeUnique >) => {
        state.loading = false;
        state.success = true;
        state.accessory.push(action.payload);
       })
      .addCase(UpdateAcesory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(AddAcesory.pending, (state) => {   
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddAcesory.fulfilled, (state, action: PayloadAction<TypeUnique >) => {
        state.loading = false;
        state.success = true;
        state.accessory.push(action.payload);
       })
      .addCase(AddAcesory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
       
      ;
  },
});

export const { clearError  } = accessorySlice.actions;
export default accessorySlice.reducer;