import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
 
interface Agency {
  id: number;
  name: string;
  phone: number;
  email: string;
  location: string;
}

interface UserState {
  id: number | null;
  name: string;
  login: string;
  status: string;
  role: string[];
  branch?: Agency;
  token?: string;
}

const initialState: UserState = {
  id: null,
  name: '',
  login: '',
  status: '',
  role: [],
  branch: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },

    setBranch: (state, action: PayloadAction<Agency>) => {
        state.branch = action.payload;
        },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser,setBranch } = userSlice.actions;
export default userSlice.reducer;

