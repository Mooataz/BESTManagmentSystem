import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AddOneRaisons, getAllExpertiseRaisons, UpdateOneRaison } from '../Actions/Administration/RaisonsExpertiseActions';
import type { TypeUnique } from '../Types/repairTypes';

interface EmployèesState {
  ExpertiseRaisons: TypeUnique[]; // Pour stocker plusieurs réparations
    // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: EmployèesState = {
  ExpertiseRaisons: [],
   
  loading: false,
  success: false,
  error: null,
};

const ExpertiseReasonSlice = createSlice({
  name: 'expertiseReasons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(getAllExpertiseRaisons.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllExpertiseRaisons.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.ExpertiseRaisons=action.payload;  
      })
      .addCase(getAllExpertiseRaisons.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(AddOneRaisons.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddOneRaisons.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.ExpertiseRaisons=action.payload;  
      })
      .addCase(AddOneRaisons.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(UpdateOneRaison.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateOneRaison.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.ExpertiseRaisons=action.payload;  
      })
      .addCase(UpdateOneRaison.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = ExpertiseReasonSlice.actions;
export default ExpertiseReasonSlice.reducer;