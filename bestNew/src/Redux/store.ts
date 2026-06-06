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
import modelsReducer from './ModelAndAccessory/modelsSlise'
import allpartsReducer from './Administration/AllPartSlice'
import companyReducer from './Administration/companySlice'
import agenciesReducer from './Administration/agencieSlice'
import customerReducer from './Customer/customerSlice';
import distributerReducer from './Administration/distributerSlice';
 import listfaultReducer from './Administration/ListFaultSlice';
import CustomerRequestReducer from './Administration/CustomerRequestSlice';
import EmployèesReducer from './Administration/EmployèesSlice';
import MarquesReducer from './Administration/MarquesSlice';
import stockPartsReducer from './Stock/RemplissageStockSlice';
import expertiseReasonsReducer from './Administration/ExpertiseReasonSlice';
import DemandeClientReducer from './Administration/DemandeClientSlice';
import NotesCustomerReducer from './Administration/NotesCustomerSlice';
import LevelRepairReducer from './Administration/LevelRepairSlice';
import TransfertReducer from './Stock/TransfertSlice';
import OtherCostReducer from './Administration/AutresFraisSlice';
import accessoryReducer from './ModelAndAccessory/AccessorySlice';
import TypeModelReducer from './ModelAndAccessory/TypeModelSlice';
import DeviceRducer from './Customer/DeviceSlice';
import PartPriceReducer from './Stock/PartPriceSlice';
import RepairActionReducer from './Administration/ActionRepairSlice';
import OutputListReducer from './recptionSlices/OutPutSlice'
import stockAlertReducer from './Stock/StockAlertSlice'
import techAssignReducer from './Coordinate/techAssignSlice'

//store
const rootReducer = combineReducers({
      repair: repairReducer,
      user: userReducer,
      auth: authReducer,
      historyRepair: historyRepairReducer,
      legislation:legislationReducer,
      bin: binReducer,
      references: refrencesReucer,
      models: modelsReducer,
      allParts:allpartsReducer,
      company: companyReducer,
      agencies: agenciesReducer,
      customer:customerReducer,
      distributer:distributerReducer,
       listfault: listfaultReducer,
      CustomerRequest: CustomerRequestReducer,
      Employèes:EmployèesReducer,
      Marques:MarquesReducer,
      stockParts: stockPartsReducer,
      expertiseReasons: expertiseReasonsReducer,
      DemandeClient: DemandeClientReducer,
      NotesCustomer:NotesCustomerReducer,
      LevelRepair: LevelRepairReducer,
      Transfert: TransfertReducer,
      OtherCost: OtherCostReducer,
      accessory: accessoryReducer,
      TypeModel: TypeModelReducer,
      device: DeviceRducer,
      PartPrice: PartPriceReducer,
      RepairAction: RepairActionReducer,
      OutputList: OutputListReducer,
      stockAlert: stockAlertReducer,
      techAssign: techAssignReducer,

});
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'company']
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


