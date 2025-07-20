import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AddFrais, GetAllFrais, UpdateFrais } from "../Actions/Administration/AutresFraisActions";
import type { FormLisFrais } from "../Types/administrationTypes";

interface AllPartState {
    autresFrais: FormLisFrais[]; // Pour stocker plusieurs réparations

    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: AllPartState = {
    autresFrais: [],
    loading: false,
    success: false,
    error: null,
};

const AutresFraisSlice = createSlice({
    name: 'OtherCost',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        // Ajoutez d'autres reducers si nécessaire
    },
    extraReducers: (builder) => {
        builder



            .addCase(AddFrais.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(AddFrais.fulfilled, (state, action: PayloadAction<FormLisFrais>) => {
                state.loading = false;
                state.success = true;
                state.autresFrais.push(action.payload);
            })
            .addCase(AddFrais.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })
            .addCase(GetAllFrais.pending, (state) => {  
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(GetAllFrais.fulfilled, (state, action: PayloadAction<FormLisFrais[]>) => {
                state.loading = false;
                state.success = true;
                state.autresFrais=action.payload;
            })
            .addCase(GetAllFrais.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })
            .addCase(UpdateFrais.pending, (state) => {   
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(UpdateFrais.fulfilled, (state, action: PayloadAction<FormLisFrais>) => {
                state.loading = false;
                state.success = true;
                state.autresFrais.push(action.payload);
            })
            .addCase(UpdateFrais.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Erreur inconnue';
            })
            ;
    },
});

export const { clearError } = AutresFraisSlice.actions;
export default AutresFraisSlice.reducer;