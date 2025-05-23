import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 


    export const getCustomer = async () =>{
      try {
        const response = await API.get('customers');
        return response.data.data;
      } catch (error) {
        console.error( error);
            throw error;
      }
    }
           export const getOneCustomer = async (data:any) => {
          try {
            const response = await API.post(`customers/findByName `  ,{name: data.name, phone: data.phone, distributer: data.distributer} );
            return response.data.data;
          } catch (error) {
            console.error( error);
                throw error;
          }
        }

    export const getDevices = async () =>{
      try {
        const response = await API.get('devices');
        return response.data.data;
      } catch (error) {
        console.error( error);
            throw error;
      }
    }

           export const getOneDevice = async (data:any) => {
            console.log('data api: ', data.serialenumber, ' _ ',data.purchaseDate.toISOString(),' _ ',data.model.id)
          try {
             const formData = new FormData();
                formData.append('serialenumber', data.serialenumber);
                formData.append('purchaseDate', data.purchaseDate.toISOString() ); // doit être string (toISOString)
                formData.append('model', data.model.id);
                if (data.warrentyProof instanceof File) {
                  formData.append('warrentyProof', data.warrentyProof);
    }  
            const response = await API.post('devices/Device', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
            return response.data.data;
          } catch (error) {
            console.error( error);
                throw error;
          }
        }
       export const addRepair = async (data:any) => {
          try {
            const response = await API.post('repair/',data);
            return response.data.data;
          } catch (error) {
            console.error( error);
                throw error;
          }
        }
