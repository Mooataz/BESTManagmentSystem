import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Accessory } from "../../Types/repairTypes";
 

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