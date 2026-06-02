import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getStockAlerts, markAlertRead } from '../Actions/stock/StockAlertActions';

interface AlertItem {
  brand: string;
  model: string;
  part: string;
  quantity: number;
}

interface StockAlertData {
  id: number;
  branchId: number;
  report: AlertItem[];
  readBy: string[];
  createdAt: string;
  isRead: boolean;
}

interface StockAlertState {
  alerts: StockAlertData[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: StockAlertState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const StockAlertSlice = createSlice({
  name: 'stockAlert',
  initialState,
  reducers: {
    clearAlertError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStockAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockAlerts.fulfilled, (state, action: PayloadAction<StockAlertData[]>) => {
        state.loading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter((a) => !a.isRead).length;
      })
      .addCase(getStockAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur';
      })
      .addCase(markAlertRead.fulfilled, (state, action: PayloadAction<StockAlertData>) => {
        const idx = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) {
          state.alerts[idx] = action.payload;
          state.unreadCount = state.alerts.filter((a) => !a.isRead).length;
        }
      });
  },
});

export const { clearAlertError } = StockAlertSlice.actions;
export default StockAlertSlice.reducer;
