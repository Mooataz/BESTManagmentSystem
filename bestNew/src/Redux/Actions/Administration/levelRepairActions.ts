import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../../Types/authenTypes';
import { store } from "../../store";
import type { TypeUnique } from "../../Types/repairTypes";
import type { LevelRepairForm } from "../../Types/administrationTypes";
 
 export const getLevelRepair = createAsyncThunk <
  LevelRepairForm[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `LevelRepair/getAll`,
   async (  ) => {
 
     try {
       const response = await API.get(`level-repair`);
        
       return response.data.data;
     } catch (error: any) {
       return  error.response?.data?.message || 'Échec de récupération '
        
     }
   }
 );
  export const AddLevelRepair = createAsyncThunk <
  LevelRepairForm,             // Résultat (success)
  LevelRepairForm,                     // Argument
  AsyncThunkConfig   
>(
   `LevelRepair/AddOne`,
   async (data ,{rejectWithValue} ) => {
 
     try {
       const response = await API.post(`level-repair`,data);
        
       return response.data.data;
     } catch (error: any) {
       return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'ajoute '
      );
        
     }
   }
 );

   export const UpdateOnelevelRepair = createAsyncThunk <
  LevelRepairForm,             // Résultat (success)
  LevelRepairForm,                     // Argument
  AsyncThunkConfig   
>(
   `LevelRepair/UpdateOne`,
   async (data ,{rejectWithValue} ) => {
 
     try {
       const response = await API.patch(`level-repair/${data.id}`,data);
        
       return response.data.data;
     } catch (error: any) {
       return rejectWithValue(
        error.response?.data?.message || 'Échec de modification '
      );
        
     }
   }
 );