import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  });

interface ListAllPart {
      description: string;  
}
interface Part {
  id?: number;
  description: string;
}

  export const addPart = async (data:ListAllPart) => {
    try {
      const response = await API.post('all-parts',data);
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }
  export const getListAllParts = async () =>{
    try {
      const response = await API.get('all-parts');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }
  
  export const updatePart = async (data:Part) => {
    try {
      const response = await API.patch(`all-parts/${data.id}`, data);
      return response.data.data;
    } catch (error) {
       console.error( error);
          throw error;
    }
  }

