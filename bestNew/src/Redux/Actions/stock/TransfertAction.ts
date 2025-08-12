import axios from 'axios';
  import type { AsyncThunkConfig  } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FormStock, TransfertPR } from '../../Types/Stock';
  
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,  
});


export const AddOneTransfert = createAsyncThunk<
 TransfertPR,
TransfertPR,
  AsyncThunkConfig
>(
  'Transfert/AddOne',
  async (body, { rejectWithValue }) => {
 
    try {
      const response = await API.post(`transfert`, body);
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);
export const UpdateOneTransfert = createAsyncThunk<
 TransfertPR,
any,
  AsyncThunkConfig
>(
  'Transfert/UpdateOne',
  async (body, { rejectWithValue }) => {
 
 const { id } = body;
const update = {
  state: body.state,
  receivedDate: body.receivedDate,
  receiveUser: body.receiveUser,
};
    try {
      const response = await API.patch(`transfert/${id}`, update);
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);

export const GetSendTransfert = createAsyncThunk<
 TransfertPR[],
any,
  AsyncThunkConfig
>(
  'Transfert/GetSendTransfert',
  async (data, { rejectWithValue }) => {
 
    try {
      const response = await API.get(`transfert/findFromBranchId/${data.branchId}/${data.type}` );
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);
/* export const GetReceiveTransfert = createAsyncThunk<
 TransfertPR[],
any,
  AsyncThunkConfig
>(
  'Transfert/GetReceiveTransfert',
  async (data, { rejectWithValue }) => {
 
    try {
      const response = await API.get(`transfert/findToBranchId/${data.branchId}/${data.type}/${data.state}` );
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);  */

export const GetReceiveTransfert = createAsyncThunk<
 TransfertPR[],
any,
  AsyncThunkConfig
>(
  'Transfert/GetReceiveTransfert',
  async (data, { rejectWithValue }) => {
 
    try {
      const response = await API.get(`transfert/findToBranchId/${data.branchId}/${data.type}/${data.state}` );
  
 
      return response.data.data;
       
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
); 