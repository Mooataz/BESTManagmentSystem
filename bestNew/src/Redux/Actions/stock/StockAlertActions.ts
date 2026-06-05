import { API } from '../../../services/api';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const getStockAlerts = createAsyncThunk<
  any[],
  { branchId: number; userId: number }
>('stockAlert/getAlerts', async ({ branchId, userId }, { rejectWithValue }) => {
  try {
    const response = await API.get(`apiApp/stock-alert/${branchId}/${userId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur');
  }
});

export const markAlertRead = createAsyncThunk<
  any,
  { alertId: number; userId: number }
>('stockAlert/markRead', async ({ alertId, userId }, { rejectWithValue }) => {
  try {
    const response = await API.patch(`apiApp/stock-alert/${alertId}/read/${userId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Erreur');
  }
});
