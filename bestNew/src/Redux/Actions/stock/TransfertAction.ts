import { API } from '../../../services/api';
  import type { AsyncThunkConfig  } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { FormStock, TransfertPR } from '../../Types/Stock';
  


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

export const FetchRepairTransfers = createAsyncThunk<
  TransfertPR[],
  number,
  AsyncThunkConfig
>(
  'Transfert/FetchRepairTransfers',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await API.get(`transfert/repair/branch/${branchId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec du chargement');
    }
  }
);

export const AcceptRepairTransfer = createAsyncThunk<
  TransfertPR,
  { id: number; userId: number },
  AsyncThunkConfig
>(
  'Transfert/AcceptRepairTransfer',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`transfert/repair/${id}/accept`, { userId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Échec de l'acceptation");
    }
  }
);

export const RefuseRepairTransfer = createAsyncThunk<
  TransfertPR,
  { id: number; userId: number },
  AsyncThunkConfig
>(
  'Transfert/RefuseRepairTransfer',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`transfert/repair/${id}/refuse`, { userId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec du refus');
    }
  }
);

export const CancelRepairTransfer = createAsyncThunk<
  TransfertPR,
  { id: number; userId: number },
  AsyncThunkConfig
>(
  'Transfert/CancelRepairTransfer',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`transfert/repair/${id}/cancel`, { userId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Échec de l'annulation");
    }
  }
);