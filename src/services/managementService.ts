import {apiManagement} from '../api/axios';
import { CuerpoInhumado } from "../models/CuerpoInhumado";

export const getAllBodies = async () => {
    try {
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

  export const createBody = async (nuevoCuerpo: Omit<CuerpoInhumado, "idCadaver">) => {
    try {
      const response = await apiManagement.post('/cuerposinhumados', nuevoCuerpo);
      return response.data;
    } catch (error) {
      console.error("Error al crear el cuerpo:", error);
      throw error;
    }
  };
  
  