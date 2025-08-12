import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 import type { AsyncThunkConfig, Model } from "../../Types/repairTypes";
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
       
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

  export const getOneModel = createAsyncThunk< 
  Model,   
 number,
  AsyncThunkConfig 
>(
  'models/OneModel',
  async (  id,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`models/${id}`);
       
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

  export const getAllModel = createAsyncThunk< 
  Model[],   
  void,
  AsyncThunkConfig 
>(
  'models/GetAllModel',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`models`);
       
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);
  export const UpdateModel = createAsyncThunk< 
  Model,   
  Model,
  AsyncThunkConfig 
>(
  'models/UpdateModel',
  async (  data ,{rejectWithValue}  ) => {
    try {
      const response = await API.patch(`models/${data.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
       
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec   '
      );
    }
  }
);
export const UpdatePictureModel = createAsyncThunk<Model, FormData, AsyncThunkConfig>(
  'models/UpdateModel',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.patch(`models/${formData.get('id')}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec');
    }
  }
);
export const AddModel = createAsyncThunk< 
  Model,   
  FormData,
  AsyncThunkConfig 
>(
  'models/AddModel',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post(`models`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec'
      );
    }
  }
);
