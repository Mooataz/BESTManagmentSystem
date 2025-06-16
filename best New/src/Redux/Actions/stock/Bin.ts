

import axios from 'axios';
import { store } from '../../store';
import type { FormHistoryRepair  } from '../../Types/repairTypes'
import type { AsyncThunkConfig  } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Bin } from '../../Types/Stock';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
// ✅ Crée d'abord un type pour ce que tu envoies (sans ID)
export interface BinCreateDto {
  id?: number;
  name: string;
  type?: string;
  branch: number; // ou Agency si tu veux passer l'objet complet
}

export const addBin = createAsyncThunk<
 Bin,
 BinCreateDto,
  AsyncThunkConfig
>(
  'bin',
  async (body, { rejectWithValue }) => {
 
    try {
      const response = await API.post(`bin`, body);
  

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);



 export const updateBin = createAsyncThunk< 
    Bin, 
  BinCreateDto, 
 { rejectValue: string }
>(
  'bin/update',
  async (bin, { rejectWithValue }) => {
    try {
      const response = await API.patch(`bin/${bin.id}`, bin);
       
      return response.data.data; // data: Bin[]
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des bins'
      );
    }
  }
);
 
 //________________________________________________________________________________



  export const getBin = createAsyncThunk< 
  Bin[],   
  number, 
  AsyncThunkConfig
>(
  'bin/getByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await API.get(`bin/find/${branchId}`);
      
      return response.data.data; // data: Bin[]
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des bins'
      );
    }
  }
);