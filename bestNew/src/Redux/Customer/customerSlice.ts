import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Customer } from "../Types/repairTypes";
import { AddCustomer, getCustomers, getOneCustomer } from "../Actions/Reception/customerActions";
 
  
 

interface customerState {
  customer: Customer[]; // Pour stocker plusieurs réparations
  oneCustomer: Customer | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: customerState = {
  customer: [],
  oneCustomer: null,
  loading: false,
  success: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
       
    .addCase(getCustomers.fulfilled, (state, action ) => {
         state.loading = false;
         state.success = true;
         state.customer = action.payload ; // spread car c’est un tableau getOneCustomer
        })

      .addCase(getCustomers.rejected, (state, action   ) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(getOneCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
       
    .addCase(getOneCustomer.fulfilled, (state, action ) => {
         state.loading = false;
         state.success = true;
         state.oneCustomer = action.payload ; // spread car c’est un tableau 
        })

      .addCase(getOneCustomer.rejected, (state, action   ) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      })
      .addCase(AddCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      
      .addCase(AddCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.success = true;
        state.customer = [action.payload];  
      })

      .addCase(AddCustomer.rejected, (state, action   ) => {
        state.loading = false;
        state.success = false;
        state.error =
            typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
      });
  },
});

export const { clearError  } = customerSlice.actions;
export default customerSlice.reducer;