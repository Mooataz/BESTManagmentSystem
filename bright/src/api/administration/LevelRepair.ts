import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 

  interface Price{
    id?:number;
    name:string;
    price:number;
}
  export const getLevelRepair = async () =>{
    try {
      const response = await API.get('level-repair');
      return response.data.data;
    } catch (error) {
      console.error( error);
      throw error;
    }
  }

  export const addLevelRepair = async (data:Price) => {
    try {
        const response = await API.post('level-repair',data);
      return response.data.data;
    } catch (error) {
        console.error( error);
      throw error;
    }
  }

  export const updatePrice = async(data:Price) => {
    try {
        const response = await API.patch(`level-repair/${data.id}`, data);
      return response.data.data;
    } catch (error) {
        throw error;
    }
  }