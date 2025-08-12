import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { AsyncThunkConfig } from '../../Types/repairTypes';
import type { PartPriceForm } from '../../Types/Stock';
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


export const getAllPartPrice = createAsyncThunk<
  PartPriceForm[],
  void,
  AsyncThunkConfig
>(
  'PartPrice/getAll',
  async ( _ , { rejectWithValue }) => {
    try {
      const response = await API.get(`parts-price`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const AddOnePartPrice = createAsyncThunk<
  PartPriceForm,
  PartPriceForm,
  AsyncThunkConfig
>(
  'PartPrice/AddPartPrice',
  async ( data , { rejectWithValue }) => {
    try {
      const response = await API.post(`parts-price`,data);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const UpdateOnePartPrice = createAsyncThunk<
  PartPriceForm,
  PartPriceForm,
  AsyncThunkConfig
>(
  'PartPrice/UpdateOnePartPrice',
  async ( data , { rejectWithValue }) => {
    try {
      const response = await API.patch(`parts-price/${data.id}`,data);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);