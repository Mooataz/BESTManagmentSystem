import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});

/* export const loginSuccess = createAsyncThunk(
  "auth/login",
  async ( formData : any, { rejectWithValue }) => {
    try {
      const response = await API.post(`auth/signIn`, formData , {
        withCredentials: true,
      });
      console.log('Data to dispatch:', response.data);
      return response.data; // Cette valeur sera renvoyée si la promesse est résolue
    } catch (error) {
     return rejectWithValue("Erreur lors de la connexion");
    }
  }
)  */
export const loginUser = createAsyncThunk<
  any, // type de retour en cas de succès
  any, // argument (formData)
  { rejectValue: string } // type de retour en cas d'erreur
>(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('auth/signIn', formData, {
        withCredentials: true,
      });
      console.log(response.data.data)
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur');
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout", async (_, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    await axios.post(`auth/logout`,config);
  } catch (error) {
    return rejectWithValue(error);
  }
})