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
export interface LoginResponse {
  user: User;
  token: string;
  
}
export const handleAuthen = createAsyncThunk< LoginResponse, LoginCredentials, AsyncThunkConfig>(
  'auth/loginIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/signIn', { login:credentials.login, password: credentials.password });
         const user = response.data.user;
        const token = response.data.token;
         
        return { user, token };
 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la connexion');
    }
  }
);
 
export const handleLogout = createAsyncThunk<boolean, void, AsyncThunkConfig>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await API.get('auth/logout', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.removeItem('accessToken');
      return true; // Déconnexion réussie
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la déconnexion');
    }
  }
);

  export const getCurrentUser = createAsyncThunk< User, void,AsyncThunkConfig>(
    'auth/me',
    async (_, { rejectWithValue }) =>{
      const accessToken = localStorage.getItem('accessToken');
      const response = await API.get('auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as User;
    }
  )