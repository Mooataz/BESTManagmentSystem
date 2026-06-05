import { API } from '../../../services/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig } from '../../Types/authenTypes';
import type { TypeModel } from '../../Types/repairTypes';
 
export const GetAllTypeModel = createAsyncThunk<
  TypeModel[],
  void,
  AsyncThunkConfig
>(
  'TypeModel/GetAll',
  async ( _ , { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.get(`type-model` );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec !'
      );
    }
  }
);

export const UpdateTypeModel = createAsyncThunk<
  TypeModel ,
  TypeModel,
  AsyncThunkConfig
>(
  'TypeModel/Update',
  async (data, { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.patch(`type-model/${data.id}`, data );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec !'
      );
    }
  }
);


export const AjoutTypeModel = createAsyncThunk<
  TypeModel,
  TypeModel,
  AsyncThunkConfig
>(
  'TypeModel/ADD',
  async ( data , { rejectWithValue }) => {
    try {
      // Utilisation de POST pour envoyer les données dans le body
      const response = await API.post(`type-model`, data );
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec !'
      );
    }
  }
);