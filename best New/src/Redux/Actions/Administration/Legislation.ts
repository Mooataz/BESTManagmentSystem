import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../../Types/authenTypes';
import { store } from "../../store";
import type { FormOneInput } from "../../Types/administrationTypes";
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


 
 export const addLegislation = createAsyncThunk<
   FormOneInput,
   FormOneInput,
   AsyncThunkConfig
 >(
   'legislation/add',
   async (body, { rejectWithValue }) => {
 
     try {
       const response = await API.post(`legislation`, body);
        
       return response.data.data;
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       );
     }
   }
 );

 export const getLegislations = createAsyncThunk <
  FormOneInput[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `legislation/getAll`,
   async (  ) => {
 
     try {
       const response = await API.get(`legislation`);
        
       return response.data.data;
     } catch (error: any) {
       return  error.response?.data?.message || 'Échec de récupération '
        
     }
   }
 );