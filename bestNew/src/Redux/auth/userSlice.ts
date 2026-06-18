import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
 

//userSlice
interface Agency {
  id: number;
  name: string;
  phone: number;
  email: string;
  location: string;
}

export interface UserState {
  id?: number;
  login: string;
  name: string;
  status: string;
  token?: string;
  role: string[];
  branch?: Agency
}

const initialState: UserState = {
  id: 0,
  name: '',
  login: '',
  status: '',
  role: [],
  branch: {
    id: 0,
    name: '',
    phone: 0,
    email: '',
    location: ''
  },
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

