// src/store/types.ts
import type { AppDispatch } from '../store';

export interface User {
  id?: number | null;
  login: string;
  name: string;
  role: string;
  status: string;
  token?: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  success: boolean;
  error: string | null;
}

export type AsyncThunkConfig = {
  state?: unknown;
  dispatch?: AppDispatch;
  extra?: unknown;
  rejectValue: string; // Spécifie que rejectValue sera toujours une string
};