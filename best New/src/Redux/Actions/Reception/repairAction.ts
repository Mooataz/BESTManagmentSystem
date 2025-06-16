//receptionAction.ts
import axios from 'axios';
import { store } from '../../store';
import type { FormHistoryRepair, RepairForm, RepairFormInput, TypeForm } from '../../Types/repairTypes'
import type { AsyncThunkConfig, LoginCredentials } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
interface GetByBranchStepParams {
  branch: number;
  step: string;
}
// repairActions.ts
// receptionActions.ts
export const addRepair = createAsyncThunk<
  RepairForm,
  RepairForm,
  AsyncThunkConfig
>(
  'repair',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.post(`repair`, body);
       
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de création de la réparation'
      );
    }
  }
);

export const getRepairs = createAsyncThunk (
  `repair/getAll`,
  async (  ) => {

    try {
      const response = await API.get(`repair`);
       
      return response.data.data;
    } catch (error: any) {
      return  error.response?.data?.message || 'Échec de récupération de les réparations'
       
    }
  }
);

export const getRepairsByBranch = createAsyncThunk (
  `repair/getByBranch`,
  async ( branchId:number ) => {

    try {
      const response = await API.get(`repair/findByActuellyBranch/${branchId}`);
       
      return response.data.data;
    } catch (error: any) {
      return  error.response?.data?.message || 'Échec de récupération de les réparations'
       
    }
  }
);

export const getByBranchStep = createAsyncThunk<
  any[], // le type du résultat attendu (liste de réparations) FilterByUserStep
  GetByBranchStepParams,
  { rejectValue: string }
> (
  `repair/byBranchAndStep`,
  async ( data :any, { rejectWithValue } ) => { 

    try {
      const response = await API.get(`repair/byBranchAndStep?branchId=${data.branch}&step=${data.step}`   );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue( error.response?.data?.message || 'Échec de récupération de les réparations')
       
    }
  }
);
interface Assign {
  id:number
  user:number
}
export const AssignRepair = createAsyncThunk< 
  RepairForm, // le type du résultat attendu (liste de réparations)
  Assign,
  { rejectValue: string }
> (
  `repair/AssignTechRepair`,
  async ( data :Assign, { rejectWithValue } ) => {

    try { 
      const response = await API.patch(`repair/${data.id}`, data   );
     
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue( error.response?.data?.message || 'Échec de récupération de les réparations')
       
    }
  }
);
interface FilterByUserStepParams { //getByUserStep
  userId: number;
  step: string;
}

export const getByUserStep = createAsyncThunk<
  any[], // le type du résultat attendu (liste de réparations) FilterByUserStep
  FilterByUserStepParams,
  { rejectValue: string }
> (
  `repair/FilterByUserStep`,
  async ( data :any, { rejectWithValue } ) => { 

    try {
      const response = await API.get(`repair/FilterByUserStep`, {
        params: {
          userId: data.userId,
          steps: data.step
        }
      }   );
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue( error.response?.data?.message || 'Échec de récupération de les réparations')
       
    }
  }
);