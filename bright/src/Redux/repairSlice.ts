import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface RepairState {
  remark: string;
}

const initialState: RepairState = {
  remark: '',
};

const repairSlice = createSlice({
  name: 'repair',
  initialState,
  reducers: {
    setRemark: (state, action: PayloadAction<string>) => {
      state.remark = action.payload;
    },
  },
});

export const { setRemark } = repairSlice.actions;
export default repairSlice.reducer;
