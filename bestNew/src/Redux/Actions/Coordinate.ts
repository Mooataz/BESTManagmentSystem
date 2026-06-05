import { API } from '../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../Types/authenTypes';
import { store } from "../store";

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
