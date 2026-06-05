import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../../Types/authenTypes';
import { store } from "../../store";
import type { TypeUnique } from "../../Types/repairTypes";
 

 
 export const addLegislation = createAsyncThunk<
   TypeUnique,
   TypeUnique,
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
  TypeUnique[],             // Résultat (success)
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

  export const UpdateLegislations = createAsyncThunk <
  TypeUnique,             // Résultat (success)
  TypeUnique,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `legislation/Update`,
   async (body, { rejectWithValue }  ) => {
 
     try {
       const response = await API.patch(`legislation/${body.id}`,body);
        
       return response.data.data;
     } catch (error: any) {
       return  error.response?.data?.message || 'Échec de modification '
        
     }
   }
 );