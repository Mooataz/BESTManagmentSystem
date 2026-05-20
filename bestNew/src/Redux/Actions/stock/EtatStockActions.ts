import axios from 'axios';
import type { AsyncThunkConfig } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FormStock, getFormStock, TypeBranchTransfert } from '../../Types/Stock';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

export const getAllStockPartBranch = createAsyncThunk<
  getFormStock[],
  number,
  AsyncThunkConfig
>(
  'stockPart/getAll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`stock-parts/findBranch/${id}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const getTotransfert = createAsyncThunk<
  FormStock[],
  TypeBranchTransfert,
  AsyncThunkConfig
>(
  'stockParts/getTotransfert',
  async (data, { rejectWithValue }) => {

    try {
      const response = await API.get(`stock-parts/find/${data.typePart}/${data.branchId}`);


      return response.data.data;

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
); 
       
export const getOnePart = createAsyncThunk<
  getFormStock,
  number,
  AsyncThunkConfig
>(
  'stockPart/getOnePart',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`stock-parts/${id}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

interface AddHistoryParams {
  id: number;
  userId: number;
  step: string;
}
export const AddhistoryOnePart = createAsyncThunk<
  getFormStock,
  AddHistoryParams,
  AsyncThunkConfig
>(
  'stockPart/AddhistoryOnePart',
  async ({ id, userId, step }, { rejectWithValue }) => {
    try {
      const response = await API.get(`AddHistorytockPart/${id}/${userId}/${step}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);