import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, // utile si tu envoies des cookies / tokens
});


export const CreateRepairPDF = async (id: number) => {
  try {
    const response = await API.get(`pdf/repair/${id}`, {
      responseType: 'blob', // Important pour recevoir le PDF
    });
// Crée un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
 
  window.open(url, '_blank');
  } catch (error) {
    console.error(error);
    throw error;
  }
}