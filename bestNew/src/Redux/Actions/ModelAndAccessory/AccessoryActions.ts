import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AsyncThunkConfig } from '../../Types/authenTypes';
import type { TypeUnique } from '../../Types/repairTypes';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
export const GetAllAccessory = createAsyncThunk<
  TypeUnique[],
  void,
  AsyncThunkConfig
>(
  'accessory/GetAll',
  async ( _ , { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.get(`accessory` );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec !'
      );
    }
  }
);

export const UpdateAcesory = createAsyncThunk<
  TypeUnique ,
  TypeUnique,
  AsyncThunkConfig
>(
  'accessory/Update',
  async ( data , { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.patch(`accessory/${data.id}`, data );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec !'
      );
    }
  }
);

export const AddAcesory = createAsyncThunk<
  TypeUnique ,
  TypeUnique,
  AsyncThunkConfig
>(
  'accessory/Add',
  async ( data , { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.post(`accessory`, data );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec !'
      );
    }
  }
);