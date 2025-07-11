import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 import type { Model } from "../../Types/repairTypes";
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


 

  export const getModelsAuthorised = createAsyncThunk< 
  Model[],   
 
  void 
>(
  'models/findByBrandAuthorised',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`models/findByBrandAuthorised`);
      console.log(response.data.data);
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);