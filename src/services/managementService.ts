import { NichoCuerpoCreate } from '@/models/NichoCuerpo';
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

export const getAllNichos = async () => {
  try {
    const response = await apiManagement.get('/nichos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los nichos:", error);
    throw error;
  }
};

export const getAllNichosCuerpos = async () => {
  try {
    const response = await apiManagement.get('/nichoscuerpos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los nichos y cuerpos:", error);
    throw error;
  }
};

export const getNichoById = async (codigo: string) => {
  try {
    const response = await apiManagement.get(`/nichos/${codigo}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los nichos:", error);
    throw error;
  }
};

export const getCuerpoInhumadoByNicho = async (codigo: string) => {
  try {
    const response = await apiManagement.get(`/nichoscuerpos/nicho/${codigo}`);
    console.log(response.data);
    return response.data; // Añade esta línea para devolver los datos
  } catch (error) {
    console.error("Error al obtener el cuerpo inhumado por nicho:", error);
    throw error;
  }
};

export const createNichoCuerpo = async (payload: NichoCuerpoCreate) => {
  try {
    const response = await apiManagement.post("/nichoscuerpos", payload);
    return response.data; // o simplemente return true;
  } catch (err: any) {
    // Puedes inspeccionar err.response.status o err.response.data
    const message =
      err.response?.data?.message ||
      `Error al asignar nicho (status ${err.response?.status})`;
    throw new Error(message);
  }
};

export const releaseNicho = async (codigoNicho: string) => {
  // pide al backend el DTO de la relación activa
  const relacion = await apiManagement.get(`/nichoscuerpos/nichoByID/${codigoNicho}`);
  console.log("relacion", relacion.data.id);
  // borra la relación
  await apiManagement.delete(`/nichoscuerpos/${relacion.data.id}`);
};

  