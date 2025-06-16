import axios from 'axios';
import { store } from '../../store';
import type { FormHistoryRepair  } from '../../Types/repairTypes'
import type { AsyncThunkConfig  } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

export const addHistoryRepair = createAsyncThunk<
 FormHistoryRepair,
 FormHistoryRepair,
  AsyncThunkConfig
>(
  'historyReppair',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.post(`history-repair`, body);
  

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);