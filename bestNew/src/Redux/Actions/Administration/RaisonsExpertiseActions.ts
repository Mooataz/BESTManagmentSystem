import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
 import type { AsyncThunkConfig, TypeUnique  } from "../../Types/repairTypes";


  export const getAllExpertiseRaisons = createAsyncThunk< 
  TypeUnique[],   
  void ,
   { rejectValue: string }
>(
  'expertiseReasons/GetAll',
  async (  _ ,{rejectWithValue}  ) => {
    try {
      const response = await API.get(`expertise-reasons`);
     
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de la récupération '
      );
    }
  }
);

export const AddOneRaisons = createAsyncThunk< 
  TypeUnique[],   
 TypeUnique,
  AsyncThunkConfig  
>(
  'expertiseReasons/Add',
  async (  data ,{rejectWithValue}  ) => {
   
    try {
         
      const response = await API.post(`expertise-reasons`, data,
  {
    headers: {
      'Content-Type': 'application/json',
    },
  });
      
      return response.data.data;  
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'ajoute '
      );
    }
  }
)

export const UpdateOneRaison = createAsyncThunk<
  TypeUnique[],
  TypeUnique,
  AsyncThunkConfig
>(
  'expertiseReasons/Update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.patch(`expertise-reasons/${data.id}`, data,  );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Échec de la mise à jour" 
      );
    }
  }
);

export const GetOneRaison = createAsyncThunk<
  TypeUnique,
  number,
  AsyncThunkConfig
>(
  'expertiseReasons/GetOneRaison',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`expertise-reasons/${id}`   );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Échec rècuperation"  
      );
    }
  }
);