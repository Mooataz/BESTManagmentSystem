import axios from 'axios';
 import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig, Customer } from '../../Types/repairTypes';
 
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


  export const getCustomers = createAsyncThunk< 
  Customer[],   
 
  void 
>(
  'customer/getAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`customers`);
      
      return response.data.data; // data: Bin[] findByName
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des bins'
      );
    }
  }
);
export const getOneCustomer = createAsyncThunk< 
  Customer,   
 number,
  AsyncThunkConfig 
>(
  'customer/getOne',
  async (  id ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`customers/${id}`);
      
      return response.data.data; // data: Bin[] findByName
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération des bins'
      );
    }
  }
); 
export const AddCustomer = createAsyncThunk<
  Customer,
  Customer,
  AsyncThunkConfig
>(
  'repair/AddCustomer',
  async (body, { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.post(`customers/findByName/`,   body  );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoi'
      );
    }
  }
);
export const UpdateOneCustomer = createAsyncThunk<
  Customer,
  Customer,
  AsyncThunkConfig
>(
  'customer/Update',
  async (body, { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.patch(`customers/${body.id}`,   body  );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoi'
      );
    }
  }
);