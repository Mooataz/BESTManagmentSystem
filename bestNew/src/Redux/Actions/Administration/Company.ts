import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Company } from "../../Types/administrationTypes";
import type { AsyncThunkConfig } from "../../Types/repairTypes";

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

 export const getCompany = createAsyncThunk <
  Company,             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `company/get`,
   async (  ) => {
 
     try {
      const response = await API.get('company');
      return response.data.data[0];
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );

 

   export const updateCompany = createAsyncThunk<
  Company,                         // résultat attendu
  Partial<Company> & { id: number }, // payload accepté
  AsyncThunkConfig
>(
  'company/Update',
  async (body, { rejectWithValue }) => {
    try {
      const response = await API.patch(`company/${body.id}`, body);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec');
    }
  }
);
