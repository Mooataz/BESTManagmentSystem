import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  });

    export const getusers = async () =>{
      try {
        const response = await API.get('users');
        return response.data.data;
      } catch (error) {
        console.error( error);
            throw error;
      }
    }