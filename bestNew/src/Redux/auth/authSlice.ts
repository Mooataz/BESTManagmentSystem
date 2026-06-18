import { createSlice } from '@reduxjs/toolkit';
import { handleLogout, loginUser, getCurrentUser } from '../Actions/authAction';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../Types/authenTypes';
import type { Agency } from '../Types/Stock';

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
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.success = false;
      })
      .addCase(handleLogout.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const { clearError, setBranch } = authSlice.actions;
export default authSlice.reducer;