import axios from 'axios';
import { store } from '../../Redux/store';
 
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
import type {RepairForm, TypeForm } from '../Types/repairTypes'
import type { AsyncThunkConfig, LoginCredentials } from '../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
/* export const addRepair = async (data: any) => {
  try {
    //const token = store.getState().auth.token;
    const response = await API.post('repair', data );
  
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}; */
export const addRepair = createAsyncThunk<RepairForm, RepairForm, AsyncThunkConfig>(
  'repair',
  async (credentials, { rejectWithValue }) => {
    const {accessoryIds,listFaultIds,customerRequestIds,deviceStateReceive,remark,actuellyBranch,device,customer} = data<TypeForm>
    try {
      const response = await API.post('repair', credentials);
      return response.data.data as TypeForm;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la connexion');
    }
  }
);