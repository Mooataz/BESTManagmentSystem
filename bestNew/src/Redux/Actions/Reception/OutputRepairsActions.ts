import { API } from '../../../services/api';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AsyncThunkConfig } from "../../Types/authenTypes";
import type { OutputListForm } from "../../Types/repairTypes";


export const addOutPut = createAsyncThunk<
 OutputListForm,
 OutputListForm,
  AsyncThunkConfig
>(
  'OutputList/addOutPut',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.post(`output-list`, body);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);

export const GetOutPutBranch = createAsyncThunk<
 OutputListForm[],
 number,
  AsyncThunkConfig
>(
  'OutputList/GetOutPutBranch',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.get(`output-list/findByBranch/${body}`, );
  

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);


export const GetOneOutPut  = createAsyncThunk<
 OutputListForm,
 number,
  AsyncThunkConfig
>(
  'OutputList/GetOneOutPut',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.get(`output-list/${body}` );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de l\'envoie'
      );
    }
  }
);