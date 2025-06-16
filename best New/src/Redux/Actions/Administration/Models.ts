import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, AsyncThunkConfig, User  } from '../../Types/authenTypes';
import { store } from "../../store";
import type { FormOneInput } from "../../Types/administrationTypes";
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});