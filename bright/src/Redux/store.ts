// src/store.ts
// Exemple : import de ton reducer
import repairReducer from './recptionSlices/addRepairSlice';
import userReducer from './auth/userSlice';
import authReducer from './auth/authSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistReducer, type PersistConfig} from 'redux-persist'
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import historyRepairReducer from './recptionSlices/historyRepairSlice'
import receiveRepairReducer from './recptionSlices/ReceiveSlice'
import legislationReducer from './Administration/LegislationSlice'

const rootReducer = combineReducers({
    repair: repairReducer,
    user: userReducer,
    auth: authReducer,
    historyRepair: historyRepairReducer,
    receiveRepair: receiveRepairReducer,
    legislation:legislationReducer,
});
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Seulement persister l'auth si nécessaire
}
const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


