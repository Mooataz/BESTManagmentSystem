import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AsyncThunkConfig } from "../../Types/repairTypes";
import type { User } from "../../Types/authenTypes";
    
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
interface Employees{
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch?: number
}


interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
 
 
 export const getusers = createAsyncThunk <
  User[],             // Résultat (success)
  void,                     // Argument
  { rejectValue: string }   // En cas d'erreur
>(
   `Employèes/get`,
   async (  ) => {
 
     try {
      const response = await API.get('users');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
   }
 );

    export const updateEmployee = createAsyncThunk<
   User[],                         // résultat attendu
   Partial<User> & { id: number }, // payload accepté
   AsyncThunkConfig
 >(
   'Employèes/Update',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.patch(`users/${body.id}`, body);
       return response.data.data;
     } catch (error: any) {
       return rejectWithValue(error.response?.data?.message || 'Échec');
     }
   }
 );

     export const AddEmployee = createAsyncThunk<
   User ,                         // résultat attendu
   User, // payload accepté
   AsyncThunkConfig
 >(
   'Employèes/Ajoute',
   async (body, { rejectWithValue }) => {
     try {
       const response = await API.post(`users`, body);
       return response.data.data;
     } catch (error: any) {
       return rejectWithValue(error.response?.data?.message || 'Échec');
     }
   }
 );

/*  export const updatePassword = async (data: { id: number; currentPassword: string; newPassword: string }) => {
  const token = localStorage.getItem('accessToken'); // ou sessionStorage ou autre selon ton app
  const response = await API.patch(`auth/password/${data.id}`, {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data;
}; */
interface UpassWord{
  id: number; 
  currentPassword: string; 
  newPassword: string
}
 export const updatePassword = createAsyncThunk<
   User ,                         // résultat attendu
   UpassWord  , // payload accepté
   AsyncThunkConfig
 >(
   'Employèes/updatePassword',
   async (data, { rejectWithValue }) => {
     try {
       const token = localStorage.getItem('accessToken');
    const response = await API.patch(`auth/password/${data.id}`, {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
       return response.data.data;
     } catch (error: any) {
       return rejectWithValue(error.response?.data?.message || 'Échec');
     }
   }
 );
 