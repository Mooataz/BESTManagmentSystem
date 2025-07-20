import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../Types/authenTypes';
import { store } from "../store";
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

interface Tech {
    branchId: number,
    admin: boolean
}

export const AssignTech = createAsyncThunk<
  User[],
  Tech,
  AsyncThunkConfig
>(
  'users/userAssign',
  async (body, { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.post(`users/userAssign/`,   body  );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoi'
      );
    }
  }
);
