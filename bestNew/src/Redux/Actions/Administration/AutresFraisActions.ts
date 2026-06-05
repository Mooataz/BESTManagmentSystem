import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Accessory } from "../../Types/repairTypes";
import type { FormLisFrais } from "../../Types/administrationTypes";
 


export const AddFrais = createAsyncThunk<
   FormLisFrais,     // <-- Ce que le backend retourne
   FormLisFrais,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'OtherCost/add',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.post('other-cost/', body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       );
     }
   }
 );

 export const GetAllFrais = createAsyncThunk<
   FormLisFrais[],     // <-- Ce que le backend retourne
   void,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'OtherCost/GetAll',
   async ( _ , { rejectWithValue }) => {
     try {
       const response = await API.get('other-cost');
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec   '
       );
     }
   }
 );

 export const UpdateFrais = createAsyncThunk<
   FormLisFrais,     // <-- Ce que le backend retourne
   FormLisFrais,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'OtherCost/update',
   async ( data , { rejectWithValue }) => {
     try {
       const response = await API.patch(`other-cost/${data.id}`, data);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec   '
       );
     }
   }
 );