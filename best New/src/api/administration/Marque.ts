import axios from 'axios';

 const API = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true, // utile si tu envoies des cookies / tokens
  }); 
 
export const addMarque = async (data: FormData) => {
  try {
    const response = await API.post(`brands`, data, {
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

export const getMarque = async () => {
try {
    const response = await API.get(`brands`)
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateMarque = async (data:any) => {
  try {
    const response = await API.patch(`brands/${data.id}`, data)
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

}
export const getOneMarque = async (data:any) => {
  try {
    const response = await API.get(`brands/${data}`)
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }

}

