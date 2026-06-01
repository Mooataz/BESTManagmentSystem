import { createSlice,   } from '@reduxjs/toolkit';
import { handleAuthen, handleLogout, loginUser  } from '../Actions/authAction';
import type { PayloadAction, AsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../Types/authenTypes';
import type { Agency } from '../Types/Stock';
//import type { AuthState, AsyncThunkConfig,User  } from './Types/authenTypes';


//authSlice.ts
  
interface AuthState {
  user: User | null | undefined;
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
},

setBranch: (state, action: PayloadAction<Agency>) => {
  if (state.user) {
    state.user.branch = action.payload;
  }
},


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
      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.success = false;
        localStorage.removeItem('token');
      })
      .addCase(handleLogout.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      })
      .addCase(handleAuthen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleAuthen.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        if (action.payload?.token) {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(handleAuthen.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { clearError, setBranch } = authSlice.actions;
export default authSlice.reducer;