import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { addRepair } from '../Actions/Reception/repairAction';
import type {RepairForm} from '../Types/repairTypes'
import { addLegislation, getLegislations } from '../Actions/Administration/Legislation';
import type { FormOneInput } from '../Types/administrationTypes';
 
interface LegislationState {
  legislation: FormOneInput[]; // Pour stocker plusieurs réparations
  currentlegislation: FormOneInput | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: LegislationState = {
  legislation: [],
  currentlegislation: null,
  loading: false,
  success: false,
  error: null,
};

const legislationSlice = createSlice({
  name: 'legislation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLegislation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addLegislation.fulfilled, (state, action: PayloadAction<FormOneInput>) => {
        state.loading = false;
        state.success = true;
        state.currentlegislation = action.payload;
        state.legislation.push(action.payload); // Ajoute à l'historique
      })
      .addCase(addLegislation.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(getLegislations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getLegislations.fulfilled, (state, action: PayloadAction<FormOneInput[]>) => {
        state.loading = false;
        state.success = true;
        state.legislation=action.payload; // Ajoute à l'historique
      })
      .addCase(getLegislations.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = legislationSlice.actions;
export default legislationSlice.reducer;