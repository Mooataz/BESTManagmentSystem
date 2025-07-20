
import { createSlice   } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Agency } from '../Types/Stock';
 import { getAccessory } from '../Actions/Administration/AccessoryActions';
import type { Accessory,  TypeUnique } from '../Types/repairTypes';
import { getListFault } from '../Actions/Administration/ListFaultActions';
import { getCustomerRequest } from '../Actions/Administration/RequestCustomerActions';

interface CustomerRequestState {
  customerRequest: TypeUnique[]; // Pour stocker plusieurs réparations
  currentallcustomerRequest: TypeUnique | null; // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: CustomerRequestState = {
  customerRequest: [],
  currentallcustomerRequest: null,
  loading: false,
  success: false,
  error: null,
};


const customerRequestSlice = createSlice({
  name: 'CustomerRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
       
      .addCase(getCustomerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCustomerRequest.fulfilled, (state, action: PayloadAction<TypeUnique[]>) => {
        state.loading = false;
        state.success = true;
        state.customerRequest=action.payload;  
      })
      .addCase(getCustomerRequest.rejected, (state, action ) => {
        state.loading = false;
        state.success = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError  } = customerRequestSlice.actions;
export default customerRequestSlice.reducer;