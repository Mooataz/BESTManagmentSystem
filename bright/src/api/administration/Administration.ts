import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 

interface Commun{
    id:number; name: string;
}
interface addCommun{
  name: string;
}
export const deleteraisonsExpertise = async (id:number) => {
  try {
    const response = await API.delete(`expertise-reasons/${id}`);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const updateRaisonsExpertise = async (data:Commun) => {
  try {
    const response = await API.patch(`expertise-reasons/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const addRaisonsExpertise = async (data:addCommun) => {
  try {
    const response = await API.post(`expertise-reasons/`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const fetchRaisonsExpertise = async () =>{
  try {
    const response = await API.get('expertise-reasons');
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
//////////////////////////////////////////////////////////////////
export const fetchNoteToCustomer = async () =>{
  try {
    const response = await API.get('notes-customer');
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}

export const addNoteToCustomer = async (data:addCommun) => {
  try {
    const response = await API.post(`notes-customer/`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const updatenoteToCustomer = async (data:Commun) => {
  try {
    const response = await API.patch(`notes-customer/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const deleteNoteToCustomer = async (id:number) => {
  try {
    const response = await API.delete(`notes-customer/${id}`);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
//////////////////////////////////////////////////////////////////
export const fetchListdemandeClient = async () =>{
  try {
    const response = await API.get('customer-request');
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const deletedemandeClient = async (id:number) => {
  try {
    const response = await API.delete(`customer-request/${id}`);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const updateDemandeClient = async (data:Commun) => {
  try {
    const response = await API.patch(`customer-request/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}

export const addDemandeClient = async (data:addCommun) => {
  try {
    const response = await API.post(`customer-request/`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
//////////////////////////////////////////////////////////////////
export const deleteProblem = async (id:number) => {
  try {
    const response = await API.delete(`list-fault/${id}`);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const addListProbleme = async (data:addCommun) => {
  try {
    const response = await API.post(`list-fault/`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const updateListProbleme = async (data:Commun) => {
  try {
    const response = await API.patch(`list-fault/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const fetchListProbleme = async () =>{
  try {
    const response = await API.get('list-fault');
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
//////////////////////////////////////////////////////////////////
export const addAccessoire = async (data:addCommun) => {
  try {
    const response = await API.post(`accessory/`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
export const updateAccessoire = async (data:Commun) => {
  try {
    const response = await API.patch(`accessory/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
  export const fetchAccessoire = async () =>{
    try {
      const response = await API.get('accessory');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }
  //////////////////////////////////////////////////////////////////
  interface Distributor {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
    taxRegisterNumber: string;
  }
  interface addDistributor {
    name: string;
    phone: number;
    email: string;
    location: string;
    taxRegisterNumber: string;
  }
export const addDistributeur = async (data:addDistributor) => {
  try {
    const response = await API.post(`distributeur/`, data);
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}

  export const updateDistributeur = async (data: Distributor) =>{
    try {
      const response = await API.patch(`distributeur/${data.id}`, data);
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }

export const fetchDistributeur = async () =>{
  try {
    const response = await API.get('distributeur');
    return response.data.data;
  } catch (error) {
    console.error( error);
        throw error;
  }
}
//////////////////////////////////////////////////////////////////
  // Exemple d'appel à GET /api
  export const fetchBranch = async () => {
    try {
        const response = await API.get(`/branches`); // URL de l'API backend
        return response.data.data; // Les données renvoyées par l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        throw error; // Propager l'erreur pour gérer dans le frontend
      }
    
  };
  export const handleAuthen = async (credentials: { login: string; password: string }) => {
    try {
      const response = await API.post(`/auth/signIn`, credentials); // URL de l'API backend
      //Store the token (consider using httpOnly cookies in production)
      localStorage.setItem('access_token', response.data.access_token);
      
      // Redirect to dashboard

      API.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });
      
      window.location.href = '/Dashboard';

      return response.data; // Les données renvoyées par l'API

      
    } catch (error) {
      console.error('Erreur de connection:', error);
      throw error; // Propager l'erreur pour gérer dans le frontend
    }


  }