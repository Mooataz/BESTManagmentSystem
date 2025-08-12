import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
  import { getusers, updateEmployee, updatePassword } from '../Actions/Administration/EmployèesActions';
import type { User } from '../Types/authenTypes';

 interface Employees{
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch?: number
}
interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
 
interface EmployèesState {
  Employèes: User[]; // Pour stocker plusieurs réparations
   loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: EmployèesState = {
  Employèes: [],
   loading: false,
  success: false,
  error: null,
};

const EmployèesSlice = createSlice({
  name: 'Employèes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(getusers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getusers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.success = true;
        state.Employèes=action.payload;  
      })
      .addCase(getusers.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(updateEmployee.pending, (state) => { 
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.success = true;
        state.Employèes=action.payload;  
      })
      .addCase(updateEmployee.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(updatePassword.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePassword.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.success = true;
        state.Employèes.push(action.payload);  
      })
      .addCase(updatePassword.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      });
  },
});

export const { clearError  } = EmployèesSlice.actions;
export default EmployèesSlice.reducer;