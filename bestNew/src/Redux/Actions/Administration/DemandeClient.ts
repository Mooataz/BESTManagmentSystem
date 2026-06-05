import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Agency } from "../../Types/Stock";
 import type { AsyncThunkConfig } from "../../Types/authenTypes";
import type { TypeUnique } from "../../Types/repairTypes";

 export const getDemandeClient = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `DemandeClient/getAll`,
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

 export const AddDemandeClient = createAsyncThunk<
   TypeUnique,     // <-- Ce que le backend retourne
   TypeUnique,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'DemandeClient/add',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.post('customer-request/', body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       );
     }
   }
 );

 export const UpdateOneDemandeClient = createAsyncThunk<
   TypeUnique,     // <-- Ce que le backend retourne
   TypeUnique,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'DemandeClient/Update',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.patch(`customer-request/${body.id}`, body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de modification'
       );
     }
   }
 );