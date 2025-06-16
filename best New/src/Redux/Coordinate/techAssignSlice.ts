import { createSlice,   } from '@reduxjs/toolkit';
import { loginUser, logout } from '../Actions/authAction';
import type { PayloadAction, AsyncThunk } from '@reduxjs/toolkit';
import type { RepairForm } from '../Types/repairTypes';
import { addRepair } from '../Actions/Reception/repairAction';
import { AssignTech } from '../Actions/Coordinate';
import type { User } from '../Types/authenTypes';
  
 

interface userState {
  user: User[]; // Pour stocker plusieurs réparations
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: userState = {
  user: [],
  loading: false,
  success: false,
  error: null,
};

const techAssignSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(AssignTech.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      
    .addCase(AssignTech.fulfilled, (state, action: PayloadAction<User[]>) => {
         state.loading = false;
         state.success = true;
         state.user.push(...action.payload); // spread car c’est un tableau
        })

      .addCase(AssignTech.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = techAssignSlice.actions;
export default techAssignSlice.reducer;