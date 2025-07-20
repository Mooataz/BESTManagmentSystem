import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FormStock, getFormStock } from '../Types/Stock';
import { AddOneStockPart, getAllStockPart } from '../Actions/stock/RemplissageStock';
import { getAllStockPartBranch, getTotransfert } from '../Actions/stock/EtatStockActions';
//binSlice
interface ReferencesState {
    stockParts: FormStock[];
    stockPartsBranch: getFormStock[]
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: ReferencesState = {
    stockParts: [],
    stockPartsBranch: [],
    loading: false,
    success: false,
    error: null,
};

const RemplissageStockSlice = createSlice({
    name: 'stockParts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Ajoutez d'autres reducers si nécessaire
    },
    extraReducers: (builder) => {
        builder

            .addCase(AddOneStockPart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(AddOneStockPart.fulfilled, (state, action: PayloadAction<FormStock>) => {
                state.loading = false;
                state.success = true;
                state.stockParts.push(action.payload);
            })
            .addCase(AddOneStockPart.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })
            .addCase(getAllStockPart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAllStockPart.fulfilled, (state, action: PayloadAction<FormStock[]>) => {
                state.loading = false;
                state.success = true;
                state.stockParts = action.payload;
            })
            .addCase(getAllStockPart.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })
            .addCase(getAllStockPartBranch.pending, (state) => { 
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAllStockPartBranch.fulfilled, (state, action: PayloadAction<getFormStock[]>) => {
                state.loading = false;
                state.success = true;
                state.stockPartsBranch = action.payload;
            })
            .addCase(getAllStockPartBranch.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })
            .addCase(getTotransfert.pending, (state) => {  
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getTotransfert.fulfilled, (state, action: PayloadAction<FormStock[]>) => {
                state.loading = false;
                state.success = true;
                state.stockParts=action.payload;
            })
            .addCase(getTotransfert.rejected, (state, action) => {  
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })


    },
});

export const { clearError } = RemplissageStockSlice.actions;
export default RemplissageStockSlice.reducer;