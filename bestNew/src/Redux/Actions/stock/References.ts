import axios from 'axios';
  import type { AsyncThunkConfig  } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Model } from '../../Types/repairTypes';
import type { References } from '../../Types/Stock';
 
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


  export const getReferences = createAsyncThunk< 
  References[],   
 
  void 
>(
  'references/getAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`references`);
      
      return response.data.data; // data: Bin[]
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des bins'
      );
    }
  }
);
  export const getOneReference  = createAsyncThunk< 
  References ,   
 number,
  AsyncThunkConfig 
>(
  'references/getOne',
  async ( id ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`references/${id}`);
      
      return response.data.data; // data: Bin[]
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

  export const getByMaterialCode  = createAsyncThunk< 
  References ,   
 string,
  AsyncThunkConfig 
>(
  'references/getByMaterialCode',
  async ( MC ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`references/GetMC/${MC}`);
      
      return response.data.data; // data: Bin[]
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const AddOneReference = createAsyncThunk<
 References[],
References,
  AsyncThunkConfig
>(
  'References/AddOneReference',
  async (body, { rejectWithValue }) => {
 
    try {
      const response = await API.post(`references`, body);
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);




 