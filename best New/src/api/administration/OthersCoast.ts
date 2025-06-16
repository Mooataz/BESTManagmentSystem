import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 
interface Coast{
    id?: number;
    name: string;
    status: string;
}
   export const getOthersCoast = async () =>{
      try {
        const response = await API.get('other-cost');
        return response.data.data;
      } catch (error) {
        console.error( error);
            throw error;
      }
    }

      export const addCoast = async (data:Coast) => {
        try {
          const response = await API.post('other-cost',data);
          return response.data.data;
        } catch (error) {
          console.error( error);
              throw error;
        }
      }
  export const updateCoast = async (data:Coast) => {
    try {
      const response = await API.patch(`other-cost/${data.id}`, data);
      return response.data.data;
    } catch (error) {
       console.error( error);
          throw error;
    }
  }
      