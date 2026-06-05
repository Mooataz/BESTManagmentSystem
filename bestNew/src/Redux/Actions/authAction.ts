import { API } from '../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../Types/authenTypes';

export const loginUser = createAsyncThunk<User, LoginCredentials, AsyncThunkConfig>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/signIn', credentials);
      return response.data.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la connexion');
    }
  }
);

export const handleLogout = createAsyncThunk<boolean, void, AsyncThunkConfig>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await API.get('auth/logout');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la déconnexion');
    }
  }
);

export const getCurrentUser = createAsyncThunk<User, void, AsyncThunkConfig>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    const response = await API.get('auth/me');
    return response.data as User;
  }
);