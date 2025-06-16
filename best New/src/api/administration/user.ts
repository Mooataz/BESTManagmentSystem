import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  });
interface Employees{
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch?: number
}


interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
type User = {
    id: number;
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch: Agency
};

    export const getusers = async () =>{
      try {
        const response = await API.get('users');
        return response.data.data;
      } catch (error) {
        console.error( error);
            throw error;
      }
    }

    export const addEmployee = async (data:Employees) => {
        try {
          const response = await API.post(`users`, data);
          return response.data.data;
        } catch (error) {
          console.error( error);
              throw error;
        }
      }

 export const updateEmployee = async (data: Partial<User> & { id: number }) => {
  try {
    const response = await API.patch(`users/${data.id}`, data); // PATCH = mise à jour partielle
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePassword = async (data: { id: number; currentPassword: string; newPassword: string }) => {
  const token = localStorage.getItem('accessToken'); // ou sessionStorage ou autre selon ton app
  const response = await API.patch(`auth/password/${data.id}`, {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.data;
};