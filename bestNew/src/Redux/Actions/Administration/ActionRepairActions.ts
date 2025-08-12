import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TypeUnique } from "../../Types/repairTypes";

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

export const getRepairAction = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `RepairAction/getAll`,
   async (  ) => {
 
     try {
      const response = await API.get('repair-action');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );

 export const AddRepairAction = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  TypeUnique,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `RepairAction/AddRepairAction`,
   async (  data, { rejectWithValue }) => {
 
     try {
      const response = await API.post('repair-action', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       )
    }
   }
 );

 export const UpdateOneRepairAction = createAsyncThunk <
  TypeUnique,             // Résultat (success)
  TypeUnique,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `RepairAction/UpdateOneRepairAction`,
   async (  data, { rejectWithValue }) => {
 
     try {
      const response = await API.patch(`repair-action/${data.id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       )
    }
   }
 );