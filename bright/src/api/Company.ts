import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  });

  export const getCompany = async () =>{
    try {
      const response = await API.get('company');
      return response.data.data[0];
    } catch (error) {
      console.error( error);
          throw error;
    }
  }