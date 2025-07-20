import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TypeUnique } from "../../Types/repairTypes";
   
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

 export const getCustomerRequest = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `CustomerRequest/getAll`,
   async (  ) => {
 
     try {
      const response = await API.get('customer-request');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );