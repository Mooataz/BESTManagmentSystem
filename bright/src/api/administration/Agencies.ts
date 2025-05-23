import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 

  export const getAgencies = async () =>{
    try {
      const response = await API.get('branches');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }
  interface Agence {
     name: string;
    email: string; 
    location: string;
    phone: number | string;
  }
  interface Agenceis {
    id: number;
    name: string;
    email: string; 
    location: string;
    phone: number | string;
  }
  export const addAgencie = async (data:Agence) => {
    try {
      const response = await API.post('branches/',data);
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }

  export const updateAgencie = async (data:Agenceis) => {
    try {
      const response = await API.patch(`branches/${data.id}`, data);
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }