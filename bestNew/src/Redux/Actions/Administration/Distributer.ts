import axios from 'axios';
 import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig, Distributor } from '../../Types/repairTypes';
import type { UpdateDistributerPayload } from '../../../pages/Administration/Distributeurs/UpdateDistributer';
 
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


  export const getDistributers = createAsyncThunk< 
  Distributor[],   
 
  void 
>(
  'distributer/getAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`distributeur`);
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);
  export const getOneDistributer = createAsyncThunk< 
  Distributor,   
 Number,
  AsyncThunkConfig 
>(
  'distributer/getOne',
  async (  id,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`distributeur/${id}`);
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const AddOneDistributer = createAsyncThunk< 
  Distributor,           // Ce que la fonction retourne en cas de succès
  Distributor,           // Ce que la fonction prend en paramètre (formData)
  AsyncThunkConfig       // La configuration pour accèder au state ou dispatch
>(
  'distributer/AddOne',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post(`distributeur`, formData);
      return response.data.data;  // tu renvoies le distributeur créé
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Échec de l'ajoute"
      );
    }
  }
);


export const UpdateOneDistributer = createAsyncThunk< 
  any,   
 UpdateDistributerPayload,
  AsyncThunkConfig 
>(
  'distributer/UpdateOne',
  async (  data,{rejectWithValue}  ) => {
    try {
      const response = await API.patch(`distributeur/${data.id}`, data);
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec '
      );
    }
  }
);