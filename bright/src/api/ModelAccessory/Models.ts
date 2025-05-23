import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 

 export const getModels = async () =>{
    try {
      const response = await API.get('models');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }

  export const addModel = async (data: FormData) => {
    try {
      const response = await API.post(`models`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  interface Marque {

  id: number;
  name: string;
  logo: string;
  status: string;

}
interface TypeModel {
    id: number;
    description: string;
}
interface Model{
    id:number;
    name: string;
    brand: Marque;
    picture: string | File;
    typeModel:TypeModel;
    allpart: number[]
    
}
export const updateModel = async (id: number, formData: FormData) => {
  try {
    const response = await API.patch(`models/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
        
  