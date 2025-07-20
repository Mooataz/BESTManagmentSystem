import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Accessory } from "../../Types/repairTypes";
 
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

 export const getAccessory = createAsyncThunk <
  Accessory[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `accessory/getAll`,
   async (  ) => {
 
     try {
      const response = await API.get('accessory');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );