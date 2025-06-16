import axios from 'axios';
import { store } from '../../store';
import type { DataGetBranchStep, FormHistoryRepair, RepairForm, RepairFormInput, TypeForm } from '../../Types/repairTypes'
import type { AsyncThunkConfig, LoginCredentials } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


export const getByBranchStep = createAsyncThunk (
  `repair/getByBranchStep`,
  async ( data :any ) => {

    try {
      const response = await API.get(`repair/byBranchAndStep?branchId=${data.branch}&step=${data.step}`   );
     
      return response.data.data;
    } catch (error: any) {
      return  error.response?.data?.message || 'Échec de récupération de les réparations'
       
    }
  }
);