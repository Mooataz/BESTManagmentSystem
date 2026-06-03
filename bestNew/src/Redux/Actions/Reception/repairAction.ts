//repairAction.ts
import axios from 'axios';
import { store } from '../../store';
import type { FormHistoryRepair, RepairForm, RepairFormInput, TypeForm, UploadRepairFilesPayload } from '../../Types/repairTypes'
import type { AsyncThunkConfig, LoginCredentials } from '../../Types/authenTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
interface GetByBranchStepParams {
  branch: number;
  step: string;
}
// repairActions.ts
// receptionActions.ts findRepairIncomplet
export const addRepair = createAsyncThunk<
  RepairForm,
  RepairForm,
  AsyncThunkConfig
>(
  'repair',
  async (body, { rejectWithValue }) => {

    try {
      const response = await API.post(`repair`, body);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Échec de création de la réparation'
      );
    }
  }
);

export const getRepairs = createAsyncThunk(
  `repair/getAll`,
  async () => {

    try {
      const response = await API.get(`repair`);

      return response.data.data;
    } catch (error: any) {
      return error.response?.data?.message || 'Échec de récupération de les réparations'

    }
  }
);

export const getRepairsByBranch = createAsyncThunk(
  `repair/getByBranch`,
  async (branchId: number) => {

    try {
      const response = await API.get(`repair/findByActuellyBranch/${branchId}`);

      return response.data.data;
    } catch (error: any) {
      return error.response?.data?.message || 'Échec de récupération de les réparations'

    }
  }
);

export const getByBranchStep = createAsyncThunk<
  any[], // le type du résultat attendu (liste de réparations) FilterByUserStep
  GetByBranchStepParams,
  { rejectValue: string }
>(
  `repair/byBranchAndStep`,
  async (data: any, { rejectWithValue }) => {

    try {
      const response = await API.get(`repair/byBranchAndStep?branchId=${data.branch}&step=${data.step}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération de les réparations')

    }
  }
);
interface Assign {
  id: number
  user: number
}
export const AssignRepair = createAsyncThunk<
  RepairForm, // le type du résultat attendu (liste de réparations)
  Assign,
  { rejectValue: string }
>(
  `repair/AssignTechRepair`,
  async (data: Assign, { rejectWithValue }) => {

    try {
      const response = await API.patch(`repair/${data.id}`, data);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération de les réparations')

    }
  }
);
interface FilterByUserStepParams { //getByUserStep
  userId: number;
  branchId: number
  step: string;
}
export const getByUserStep = createAsyncThunk<
  any[], // Résultat attendu
  FilterByUserStepParams,
  { rejectValue: string }
>(
  'repair/FilterByUserStep',
  async (data, { rejectWithValue }) => {
    try {

      const branchId = data.branchId
      const steps = data.step

      const response = await API.get(`repair/FilterUserStep/${branchId}/${steps}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

export const getRepairIncomplet = createAsyncThunk<
  RepairForm[],
  String,
  { rejectValue: string }
>(
  `repair/findRepairIncomplet`,
  async (data: any, { rejectWithValue }) => {

    try {
      const response = await API.get(`repair/findRepairIncomplet/${data}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération  ')

    }
  }


);

export const getOneRepair = createAsyncThunk<
  RepairForm,
  number,
  { rejectValue: string }
>(
  `repair/findOneRepair`,
  async (id, { rejectWithValue }) => {
    try {

      const response = await API.get(`repair/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération  ')

    }
  }


);

type RepairFormUpdate = Partial<Omit<RepairForm, 'id'>> & { id: number };
export const UpdateOneRepair = createAsyncThunk<
  RepairForm,
  RepairFormUpdate,
  { rejectValue: string }
>(
  `repair/Update`,
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...rest } = data;
      
      const response = await API.patch(`repair/${data.id}`, rest);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de récupération  ')

    }
  }


);

export const DeleteRepairFile = createAsyncThunk<
  { id: number; files: string[] },
  { id: number; fileName: string },
  { rejectValue: string }
>(
  'repair/deleteFile',
  async ({ id, fileName }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`repair/${id}/files/${fileName}`);
      return { id, files: response.data.data.files };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur suppression fichier'
      );
    }
  }
);

export const UpdatePartFileRepair = createAsyncThunk<
  any,
  UploadRepairFilesPayload,
  { rejectValue: string }
>(
  'repair/updateWithPartsFiles',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.patch(
        `/repair/updateWithPartsFiles/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        'Erreur lors de la mise à jour (fichiers)'
      );
    }
  }
);

export interface ApproveStockItem {
  id: number;
  type?: string;
  date?: string;
  state?: string;
  idPartRepair?: number;
  repair?: {
    id: number;
    actuellybranch?: number;
    device?: any;
    user?: { id: number; name: string };
    warrenty?: boolean;
    historyRepair?: any[];
  };
}

export const getApproveStockByBranch = createAsyncThunk<
  ApproveStockItem[],
  number,
  { rejectValue: string }
>(
  'approveStock/getByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await API.get(`approve-stock/findByBranch/${branchId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de récupération'
      );
    }
  }
);

export const updateApproveStockState = createAsyncThunk<
  ApproveStockItem,
  { id: number; state: string },
  { rejectValue: string }
>(
  'approveStock/updateState',
  async ({ id, state }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`approve-stock/${id}`, { state });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de mise à jour'
      );
    }
  }
);

export interface AvailableStockPart {
  id: number;
  serialnumber?: string;
  remark?: string;
  bin?: { id: number; name: string; type: string };
  reference?: {
    id: number;
    materialCode: string;
    description?: string;
    allpart?: { id: number; description: string };
  };
}

export const getAvailableParts = createAsyncThunk<
  AvailableStockPart[],
  { approveStockId: number; branchId: number },
  { rejectValue: string }
>(
  'approveStock/getAvailableParts',
  async ({ approveStockId, branchId }, { rejectWithValue }) => {
    try {
      const response = await API.get(`approve-stock/${approveStockId}/available-parts`, { params: { branchId } });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de récupération des pièces disponibles'
      );
    }
  }
);

export const confirmApprovePart = createAsyncThunk<
  ApproveStockItem,
  { approveStockId: number; stockPartId: number; binDefectId: number; userId: number },
  { rejectValue: string }
>(
  'approveStock/confirmPart',
  async ({ approveStockId, stockPartId, binDefectId, userId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`approve-stock/${approveStockId}/confirm-part`, { stockPartId, binDefectId, userId });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de confirmation de pièce'
      );
    }
  }
);