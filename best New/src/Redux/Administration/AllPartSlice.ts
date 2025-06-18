import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {getAllPart} from '../Actions/Administration/ListAllPart'  
import type { FormAllParts } from '../Types/administrationTypes';
interface AllPartState {
  allParts: FormAllParts[]; // Pour stocker plusieurs réparations
  currentallPart: FormAllParts | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AllPartState = {
  allParts: [],
  currentallPart: null,
  loading: false,
  success: false,
  error: null,
};

const getAllPartSlice = createSlice({
  name: 'allParts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getAllPart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllPart.fulfilled, (state, action: PayloadAction<FormAllParts[]>) => {
        state.loading = false;
        state.success = true;
        state.allParts=action.payload;  
      })
      .addCase(getAllPart.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError  } = getAllPartSlice.actions;
export default getAllPartSlice.reducer;