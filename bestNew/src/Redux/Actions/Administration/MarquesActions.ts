import axios from 'axios';
 import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig, Marque } from '../../Types/repairTypes';
  
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


  export const getMarques = createAsyncThunk< 
  Marque[],   
 
  void 
>(
  'brands/getAllAutoriser',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`brands/findAutoriser`);
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

  export const getAllMarques = createAsyncThunk< 
  Marque[],   
 
  void 
>(
  'brands/getAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`brands`);
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const AddOneMarque = createAsyncThunk< 
  Marque[],   
 FormData,
  AsyncThunkConfig  
>(
  'brands/Add',
  async (  data ,{rejectWithValue}  ) => {
    try {
      const response = await API.post(`brands`, data);
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'ajoute '
      );
    }
  }
)
interface Marques {

  id: number;
  name: string;
  logo: string;
  status: string;

}
export const UpdateOneMarque = createAsyncThunk<
  Marques[],
  { id: number; formData: FormData },
  AsyncThunkConfig
>(
  'brands/Update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`brands/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Échec de la mise à jour"
      );
    }
  }
);
