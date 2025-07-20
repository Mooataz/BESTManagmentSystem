import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Agency } from '../Types/Stock';
import { addAgencies, getAgencies } from '../Actions/Administration/AgenciesActions';
 
interface AgenciesState {
  Agency: Agency[]; // Pour stocker plusieurs réparations
  currentallAgency: Agency | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AgenciesState = {
  Agency: [],
  currentallAgency: null,
  loading: false,
  success: false,
  error: null,
};

interface Agence {
     name: string;
    email: string; 
    location: string;
    phone: number  ;
  }
const agenciesSlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire 
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getAgencies.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAgencies.fulfilled, (state, action: PayloadAction<Agency[]>) => {
        state.loading = false;
        state.success = true;
        state.Agency=action.payload;  
      })
      .addCase(getAgencies.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(addAgencies.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addAgencies.fulfilled, (state, action: PayloadAction<Agency>) => {
        state.loading = false;
        state.success = true;
        state.Agency.push(action.payload);
      })
      .addCase(addAgencies.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError  } = agenciesSlice.actions;
export default agenciesSlice.reducer;