import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type {FormAllParts} from '../../Types/administrationTypes'
 const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


 

  export const getAllPart = createAsyncThunk< 
  FormAllParts[],   
 
  void 
>(
  'all-parts/getAll',
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