import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { TypeUnique } from "../../Types/repairTypes";
   

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