import axios from 'axios';
import { store } from '../store';
import type { RepairForm, RepairFormInput, TypeForm } from '../Types/repairTypes'
import type { AsyncThunkConfig, LoginCredentials } from '../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

// repairActions.ts
// receptionActions.ts
export const addRepair = createAsyncThunk<
  RepairForm,
  RepairForm,
  AsyncThunkConfig
>(
  'repair',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.post(`repair`, body);
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de création de la réparation'
      );
    }
  }
);

export const sendAssign = createAsyncThunk<
 
  AsyncThunkConfig
>(
  'assign',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.post(`repair`, body);
  

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);