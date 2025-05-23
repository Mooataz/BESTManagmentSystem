import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  });
interface Company {
  id: number;
  name: string;
  headquarterslocation: string;
  taxRegisterNumber: string;
  rib: number;
  logo: string;
  bank: string;
  quantityAlertStock: number;
}
  export const getCompany = async () =>{
    try {
      const response = await API.get('company');
      return response.data.data[0];
    } catch (error) {
      console.error( error);
          throw error;
    }
  }

   export const updateCompany = async (data: Partial<Company> & { id: number }) => {
    try {
      const response = await API.patch(`company/${data.id}`, data); // PATCH = mise à jour partielle
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };