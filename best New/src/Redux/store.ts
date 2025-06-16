// src/store.ts
 
import repairReducer from './recptionSlices/repairSlice';
import userReducer from './auth/userSlice';
import authReducer from './auth/authSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {persistReducer, type PersistConfig} from 'redux-persist'
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import historyRepairReducer from './recptionSlices/historyRepairSlice'
import legislationReducer from './Administration/LegislationSlice'
import binReducer from './Stock/binSlice';
import refrencesReucer from './Stock/referencesSlice'
 
//store
const rootReducer = combineReducers({
      repair: repairReducer,
      user: userReducer,
      auth: authReducer,
      historyRepair: historyRepairReducer,
      legislation:legislationReducer,
      bin: binReducer,
      references: refrencesReucer,
       

});
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','user','userr','repair','bin','references'] // Seulement persister l'auth si nécessaire
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


