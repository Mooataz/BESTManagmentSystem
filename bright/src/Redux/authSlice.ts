import { createSlice,   } from '@reduxjs/toolkit';
import { loginUser, logout } from './Actions/authAction';
import type { PayloadAction, AsyncThunk } from '@reduxjs/toolkit';
//import type { AuthState, AsyncThunkConfig,User  } from './Types/authenTypes';
// src/store/slices/authSlice.ts
  
interface AuthState {
  user: any | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  success: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Définition corrigée avec la syntaxe action creator
    
clearError: (state: AuthState) => {
  state.error = null;
}


  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.success = false;
        localStorage.removeItem('token');
      })
      .addCase(logout.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;