import axios from 'axios';
 import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig, Device  } from '../../Types/repairTypes';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

export const AddDevice = createAsyncThunk<
  Device,
  Device,
  AsyncThunkConfig
>(
  'repair/AddDevice',
  async (body, { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.post(`devices/Device/`,   body  );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoi'
      );
    }
  }
);

export const deviceHasOpenRepair = createAsyncThunk<
  boolean,
  string,
  AsyncThunkConfig
>(
  'device/deviceHasOpenRepair',
  async (body, { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.get(`devices/deviceHasOpenRepair/${body}`  );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoi'
      );
    }
  }
);

// Typage
type UpdateDevicePayload = {
  id: number;
} & Partial<Pick<Device, 'serialenumber' | 'purchaseDate' | 'model'>>;

export const UpdateOneDevice = createAsyncThunk<
  Device,
  UpdateDevicePayload,
  AsyncThunkConfig
>(
  'device/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`devices/${id}`, payload); // ← id dans URL, pas dans le body
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoi'
      );
    }
  }
);
