import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3000';

export const API = axios.create({
  baseURL: API_BASE_URL + '/',
  withCredentials: true,
});
