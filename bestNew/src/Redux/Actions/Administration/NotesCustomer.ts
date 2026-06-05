import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Agency } from "../../Types/Stock";
 import type { AsyncThunkConfig } from "../../Types/authenTypes";
import type { TypeUnique } from "../../Types/repairTypes";

 export const getNotesCustomer = createAsyncThunk <
  TypeUnique[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `NotesCustomer/getAll`,
   async (  ) => {
 
     try {
      const response = await API.get('notes-customer');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );

 export const AddOneNoteCustomer = createAsyncThunk<
   TypeUnique,     // <-- Ce que le backend retourne
   TypeUnique,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'NotesCustomer/add',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.post('notes-customer/', body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       );
     }
   }
 );

 export const UpdateOneNoteCustomer = createAsyncThunk<
   TypeUnique,     // <-- Ce que le backend retourne
   TypeUnique,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'NotesCustomer/Update',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.patch(`notes-customer/${body.id}`, body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de modification'
       );
     }
   }
 );