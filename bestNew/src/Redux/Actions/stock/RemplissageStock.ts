import { API } from '../../../services/api';
  import type { AsyncThunkConfig  } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FormStock } from '../../Types/Stock';
  


export const AddOneStockPart = createAsyncThunk<
 FormStock,
FormStock,
  AsyncThunkConfig
>(
  'stockParts/AddOneStock-parts',
  async (body, { rejectWithValue }) => {
 
    try {
      const response = await API.post(`stock-parts`, body);
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);
export const getAllStockPart = createAsyncThunk< 
  FormStock[],   
 
  void 
>(
  'stockParts/getAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`stock-parts`);
      
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération  '
      );
    }
  }
);