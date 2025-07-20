import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AddAcesory, GetAllAccessory, UpdateAcesory } from "../Actions/ModelAndAccessory/AccessoryActions";
import type { TypeModel, TypeUnique } from "../Types/repairTypes";
import { AjoutTypeModel, GetAllTypeModel, UpdateTypeModel } from "../Actions/ModelAndAccessory/TypeModelActions";

interface TypeModelState {
  typeModel: TypeModel[]; // Pour stocker plusieurs réparations
    // Pour la réparation actuelle
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: TypeModelState = {
  typeModel: [],
   
  loading: false,
  success: false,
  error: null,
};

const TypeModelSlice = createSlice({
  name: 'TypeModel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Ajoutez d'autres reducers si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllTypeModel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(GetAllTypeModel.fulfilled, (state, action: PayloadAction<TypeModel[]>) => {
        state.loading = false;
        state.success = true;
         
        state.typeModel=action.payload;
       })
      .addCase(GetAllTypeModel.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
       .addCase(UpdateTypeModel.pending, (state) => {  
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(UpdateTypeModel.fulfilled, (state, action: PayloadAction<TypeModel >) => {
        state.loading = false;
        state.success = true;
        state.typeModel.push(action.payload);
       })
      .addCase(UpdateTypeModel.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(AjoutTypeModel.pending, (state) => {   
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(AjoutTypeModel.fulfilled, (state, action: PayloadAction<TypeModel >) => {
        state.loading = false;
        state.success = true;
        state.typeModel.push(action.payload);
       })
      .addCase(AjoutTypeModel.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Erreur inconnue';
      })
       
      ;
  },
});

export const { clearError  } = TypeModelSlice.actions;
export default TypeModelSlice.reducer;