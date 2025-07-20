// src/store/types.ts
import type { AppDispatch } from '../store';
import type { Agency } from './Stock';

export interface User {
  id?: number  ;
  login: string;
  name: string;
  role: string[];
  status: string;
  phone?: number;
  password?: string;
  createdDate?: Date; // ou Date
  branch?: Agency | number;
  token?: string;
}
 
  
  
 

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthState {
  user: User  ;
  loading: boolean;
  success: boolean;
  error: string | null;
  phone: number ;
  password: string;
  createdDate:Date;
  branch:Agency
}

export type AsyncThunkConfig = {
  state?: unknown;
  dispatch?: AppDispatch;
  extra?: unknown;
  rejectValue: string; // Spécifie que rejectValue sera toujours une string
};