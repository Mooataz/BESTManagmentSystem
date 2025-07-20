import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getModelsAuthorised } from "../Actions/ModelAndAccessory/Models";
import type { Model } from "../Types/repairTypes";
import type { Company } from "../Types/administrationTypes";
import { getCompany, updateCompany } from "../Actions/Administration/Company";

 
interface CompanyState {
  company: Company | null; // Pour stocker plusieurs réparations
  currentcompany: Company | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  currentcompany: null,
  loading: false,
  success: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire 
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.company = action.payload; // Ajoute à l'historique
      })
      .addCase(getCompany.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCompany.fulfilled, (state, action: PayloadAction<Company>) => {
        state.loading = false;
        state.success = true;
       // state.currentmodels = action.payload;
        state.company = action.payload; // Ajoute à l'historique
      })
      .addCase(updateCompany.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      ;
  },
});

export const { clearError  } = companySlice.actions;
export default companySlice.reducer;