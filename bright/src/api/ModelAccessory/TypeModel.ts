import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 

  export const fetchTypeModel = async () =>{
    try {
      const response = await API.get('type-model');
      return response.data.data;
    } catch (error) {
      console.error( error);
          throw error;
    }
  }
interface Type {
    id?: number;
    description: string;
}

    export const addTypeModel = async (data:Type) => {
      try {
        const response = await API.post('type-model/',data);
        return response.data.data;
      } catch (error) {
        console.error( error);
            throw error;
      }
    }

    export const updateTypeModel = async (data:Type) => {
        try {
          const response = await API.patch(`type-model/${data.id}`, data);
          return response.data.data;
        } catch (error) {
          console.error( error);
              throw error;
        }
      }
      