import axios from 'axios';
import {store} from '../../Redux/store';
 
 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 
              //const result = await handleAuthen(data.login, data.password);          
              //localStorage.setItem('accessToken', result.token.accessToken);
  export const handleAuthen = async (login: string, password:string) => {
    try {
        const response = await API.post(`auth/signIn`,{ login, password });
        const user = response.data.user;
        const token = response.data.token;
        //store.dispatch(loginSuccess( {user , token }))
        return { user, token };
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message); // message d'erreur propre
          } else {
            throw new Error('Erreur réseau');
          }
    }
  }

  export const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await API.get('auth/logout', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.removeItem('accessToken');
      return true; // Déconnexion réussie
    } catch (error) {
      console.error('Erreur lors du logout', error);
      throw error;
    }
  };



  export const getCurrentUser = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await API.get('auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

   export const getUserId = async ( id:number) => {
    try {
        const response = await API.get(`users/${id}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message); // message d'erreur propre
          } else {
            throw new Error('Erreur réseau');
          }
    }
  }