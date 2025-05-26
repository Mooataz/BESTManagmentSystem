// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
// Exemple : import de ton reducer
import repairReducer from './repairSlice';
import userReducer from './userSlice';
export const store = configureStore({
  reducer: {
    repair: repairReducer,
    user: userReducer, // Ajouter d'autres reducers ici si besoin
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
