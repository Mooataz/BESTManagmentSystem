import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AsyncThunkConfig,   TypeUnique } from "../../Types/repairTypes";
  
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

 export const getListFault = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `listfault/getAll`,
   async (  ) => {
 
     try {
      const response = await API.get('list-fault');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );

 export const AddListFault = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  TypeUnique,                     // Argument
   AsyncThunkConfig    // En cas d'erreur
>(
   `listfault/Add`,
   async (formData, { rejectWithValue }  ) => {
 
     try {
      const response = await API.post('list-fault',formData,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  });
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );
export const UpdateListFault = createAsyncThunk<
  TypeUnique[],
  TypeUnique,
  AsyncThunkConfig
>(
  'listfault/update',
  async (formData, { rejectWithValue }) => {
    try {
      // Utilisation de POST au lieu de PATCH comme dans le backend
      const response = await API.patch(`list-fault/${formData.id}`, formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la mise à jour'
      );
    }
  }
);
