import { API } from '../../services/api';



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