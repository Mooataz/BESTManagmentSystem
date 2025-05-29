import axios from 'axios';
import { store } from '../../Redux/store';
 
const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});
interface Agency {
  id: number;
  name: string;
  phone: number;
  email: string;
  location: string;
}
type User = {
  id: number;
  name: string;
  phone: number;
  password: string;
  createdDate: string;
  status: string;
  login: string;
  role: string[];
  branch: Agency
};

export const getCustomer = async () => {
  try {
    const response = await API.get('customers');
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getOneCustomer = async (data: any) => {
  try {
    const response = await API.post(`customers/findByName `, { name: data.name, phone: data.phone, distributer: data.distributer });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getDevices = async () => {
  try {
    const response = await API.get('devices');
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getOneDevice = async (formData: any) => {
  try {
    const response = await API.post('devices/Device', formData);

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addRepair = async (data: any/* , user: number */) => {
  try {
    //const token = store.getState().auth.token;
    const response = await API.post('repair', data );
  
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAccessory = async () => {
  try {
    const response = await API.get('accessory');
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getListFault = async () => {
    try {
    const response = await API.get('list-fault');
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getCustomerRequest = async () => {
    try {
    const response = await API.get('customer-request');
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const ajouteHistoryRepair = async (data:any) => {
  try {
    const response = await API.post('history-repair',data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const ajouteTracabilityRepair = async (data: { 
  historyRepairId: number, 
  userId: number 
}) => {
  try {
    const response = await API.post('tracability', data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};