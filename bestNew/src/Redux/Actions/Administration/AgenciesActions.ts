import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Agency } from "../../Types/Stock";
import type { AsyncThunkConfig } from "../../Types/authenTypes";

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

 export const getAgencies = createAsyncThunk <
  Agency[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `branches/getAll`,
   async (  ) => {
 
     try {
      const response = await API.get('branches');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );
interface Agence {
  name: string;
  email: string;
  location: string;
  phone: number;
  company: number;
}

export const addAgencies = createAsyncThunk<
  Agency,     // <-- Ce que le backend retourne
  Agence,     // <-- Ce que le front envoie
  { rejectValue: string }
>(
  'agencies/add',
  async (body, { rejectWithValue }) => {
    try {
      const response = await API.post('branches/', body);
      return response.data.data; // un seul objet de type Agency
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de création de l’agence'
      );
    }
  }
);

 export const updateAgencie = createAsyncThunk<
    Agency,
    Agency,
    AsyncThunkConfig
  >(
    'branches/add',
    async (body, { rejectWithValue }) => {
  
      try {
        const response = await API.patch(`branches/${body.id}`, body);
         
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || 'Échec de création '
        );
      }
    }
  );

   