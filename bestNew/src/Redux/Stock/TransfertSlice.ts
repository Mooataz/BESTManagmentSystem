import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TransfertPR } from "../Types/Stock";
import { AcceptTransfert, AddOneTransfert, GetReceiveTransfert, GetSendTransfert, UpdateOneTransfert, FetchRepairTransfers, AcceptRepairTransfer, RefuseRepairTransfer, CancelRepairTransfer } from "../Actions/stock/TransfertAction";
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
                state.Transfert = [];
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
                state.Transfert = [];
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(FetchRepairTransfers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(FetchRepairTransfers.fulfilled, (state, action: PayloadAction<TransfertPR[]>) => {
                state.loading = false;
                state.success = true;
                state.Transfert = action.payload;
            })
            .addCase(FetchRepairTransfers.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.Transfert = [];
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(AcceptTransfert.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(AcceptTransfert.fulfilled, (state, action: PayloadAction<TransfertPR>) => {
                state.loading = false;
                state.success = true;
                const index = state.Transfert.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.Transfert[index] = action.payload;
            })
            .addCase(AcceptTransfert.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(AcceptRepairTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(AcceptRepairTransfer.fulfilled, (state, action: PayloadAction<TransfertPR>) => {
                state.loading = false;
                state.success = true;
                const index = state.Transfert.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.Transfert[index] = action.payload;
            })
            .addCase(AcceptRepairTransfer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(RefuseRepairTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(RefuseRepairTransfer.fulfilled, (state, action: PayloadAction<TransfertPR>) => {
                state.loading = false;
                state.success = true;
                const index = state.Transfert.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.Transfert[index] = action.payload;
            })
            .addCase(RefuseRepairTransfer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

            .addCase(CancelRepairTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(CancelRepairTransfer.fulfilled, (state, action: PayloadAction<TransfertPR>) => {
                state.loading = false;
                state.success = true;
                const index = state.Transfert.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.Transfert[index] = action.payload;
            })
            .addCase(CancelRepairTransfer.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })

    },
});

export const { clearError } = TransfertSlice.actions;
export default TransfertSlice.reducer;