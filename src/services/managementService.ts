import {apiManagement} from '../api/axios';

export const getAllBodies = async () => {
    try {
      // Hacemos la petición al endpoint
      const response = await apiManagement.get('/cuerposinhumados');
      return response.data;
    } catch (error) {
      console.error("Error al obtener los cuerpos:", error);
      throw error;
    }
  
  };