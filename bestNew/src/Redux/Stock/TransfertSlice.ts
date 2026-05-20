import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TransfertPR } from "../Types/Stock";
import { AddOneTransfert, GetReceiveTransfert, GetSendTransfert, UpdateOneTransfert } from "../Actions/stock/TransfertAction";
import { getTotransfert } from "../Actions/stock/EtatStockActions";

interface TransfertState {
    Transfert: TransfertPR[];

    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: TransfertState = {
    Transfert: [],

    loading: false,
    success: false,
    error: null,
};

const TransfertSlice = createSlice({
    name: 'Transfert',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Ajoutez d'autres reducers si nécessaire
    },
    extraReducers: (builder) => {
        builder

            .addCase(AddOneTransfert.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(AddOneTransfert.fulfilled, (state, action: PayloadAction<TransfertPR>) => {
                state.loading = false;
                state.success = true;
                state.Transfert.push(action.payload);
            })
            .addCase(AddOneTransfert.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(UpdateOneTransfert.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(UpdateOneTransfert.fulfilled, (state, action: PayloadAction<TransfertPR>) => {
                state.loading = false;
                state.success = true;

                // Remplacer ou insérer le transfert dans le tableau existant
                const index = state.Transfert.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.Transfert[index] = action.payload;
                } else {
                    state.Transfert.push(action.payload);
                }
            })
            .addCase(UpdateOneTransfert.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(GetSendTransfert.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(GetSendTransfert.fulfilled, (state, action: PayloadAction<TransfertPR[]>) => {
                state.loading = false;
                state.success = true;
                state.Transfert = action.payload;
            })
            .addCase(GetSendTransfert.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(GetReceiveTransfert.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(GetReceiveTransfert.fulfilled, (state, action: PayloadAction<TransfertPR[]>) => {
                state.loading = false;
                state.success = true;
                state.Transfert = action.payload;
            })
            .addCase(GetReceiveTransfert.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })


    },
});

export const { clearError } = TransfertSlice.actions;
export default TransfertSlice.reducer;