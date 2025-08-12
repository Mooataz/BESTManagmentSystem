import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {FormAllParts} from '../../Types/administrationTypes'
import type { AsyncThunkConfig, TypeUnique } from "../../Types/repairTypes";
 const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


 

  export const getAllPart = createAsyncThunk< 
  FormAllParts[],   
 
  void 
>(
  'allParts/getAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`all-parts`);
     
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);
  
export const getOnePart = createAsyncThunk< 
  FormAllParts ,   
 number,
  AsyncThunkConfig 
>(
  'allParts/getOne',
  async (  id ,{rejectWithValue}  ) => {
    try {
       
      const response = await API.get(`all-parts/${id}`);
     
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const AddOnePart = createAsyncThunk<
   FormAllParts,     // <-- Ce que le backend retourne
   FormAllParts,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'allParts/add',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.post('all-parts/', body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de création '
       );
     }
   }
 );

 export const UpdateOnePart = createAsyncThunk<
   FormAllParts,     // <-- Ce que le backend retourne
   FormAllParts,     // <-- Ce que le front envoie
   { rejectValue: string }
 >(
   'allParts/Update',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.patch(`all-parts/${body.id}`, body);
       return response.data.data; // un seul objet de type Agency
     } catch (error: any) {
       return rejectWithValue(
         error.response?.data?.message || 'Échec de modification'
       );
     }
   }
 );