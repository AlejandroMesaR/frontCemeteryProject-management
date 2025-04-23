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

  export const deleteBodyById = async (idCadaver: string) => {
    try {
      const response = await apiManagement.delete(`/cuerposinhumados/${idCadaver}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Error al eliminar el cuerpo con id ${idCadaver}:`, error);
      throw error;
    }
  };
  