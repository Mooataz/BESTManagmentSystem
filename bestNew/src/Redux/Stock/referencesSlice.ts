import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { References } from '../Types/Stock';
import { AddOneReference, getByMaterialCode, getOneReference, getReferences } from '../Actions/stock/References';
  //binSlice
interface ReferencesState {
  references: References[]; // Pour stocker plusieurs réparations
  oneReference: References | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ReferencesState = {
  references: [],
  oneReference: null,
  loading: false,
  success: false,
  error: null,
};

const referencesSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReferences.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getReferences.fulfilled, (state, action: PayloadAction<References[]>) => {
        state.loading = false;
        state.success = true;
         state.references =action.payload;
       })
      .addCase(getReferences.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })
    .addCase(AddOneReference.pending, (state) => { getOneReference
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AddOneReference.fulfilled, (state, action: PayloadAction<References[]>) => {
        state.loading = false;
        state.success = true;
         state.references =action.payload;
       })
      .addCase(AddOneReference.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })
        .addCase(getOneReference.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getOneReference.fulfilled, (state, action: PayloadAction<References>) => {
        state.loading = false;
        state.success = true;
         state.oneReference =action.payload;
       })
      .addCase(getOneReference.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })
         .addCase(getByMaterialCode.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getByMaterialCode.fulfilled, (state, action: PayloadAction<References>) => {
        state.loading = false;
        state.success = true;
         state.oneReference =action.payload;
       })
      .addCase(getByMaterialCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
        })


      
      
  },
});

export const { clearError  } = referencesSlice.actions;
export default referencesSlice.reducer;