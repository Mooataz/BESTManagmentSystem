import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../Types/authenTypes';
import { store } from "../store";
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
 // src/store/actions/authActions.ts
 
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

export const logout = createAsyncThunk<void, void, AsyncThunkConfig>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await API.post('/auth/logout');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la déconnexion');
    }
  }
);

 