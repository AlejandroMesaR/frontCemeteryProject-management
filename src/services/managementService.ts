import { NichoCuerpoCreate } from '@/models/NichoCuerpo';
import {apiManagement} from '../api/axios';
import { CuerpoInhumado } from "../models/CuerpoInhumado";
import { Nicho } from "../models/Nicho";


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

  export const updateBodyById = async (idCadaver: string, cuerpoActualizado: CuerpoInhumado) => {
    try {
      const response = await apiManagement.put(`/cuerposinhumados/${idCadaver}`, cuerpoActualizado);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el cuerpo con id ${idCadaver}:`, error);
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
  // borra la relación
  await apiManagement.delete(`/nichoscuerpos/${relacion.data.id}`);
};

export const getAvailableNichos = async (): Promise<Nicho[]> => {
  try {
    const { data } = await apiManagement.get("/nichos/disponibles");
    return data;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      `Error al obtener nichos disponibles (status ${err.response?.status})`;
    throw new Error(message);
  }
};

export const getUnassignedBodies = async (): Promise<CuerpoInhumado[]> => {
  try {
    const { data } = await apiManagement.get("/cuerposinhumados/no-asignados");
    return data;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      `Error al obtener cuerpos no asignados (status ${err.response?.status})`;
    throw new Error(message);
  }
};

export const actualizarEstadoNicho = async (codigo: string, nuevoEstado: string) => {
  try {
    const response = await apiManagement.put(`/nichos/actualizar-estado/${codigo}`, {}, {
      params:{
        estado: nuevoEstado
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del nicho:", error);
    throw error;
  }
}

export const getLastBodiesIngress = async (cantidad: number) => {
  try {
    const response = await apiManagement.get('/cuerposinhumados/ultimos',{
      params:{
        cantidad: cantidad
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el último ingreso:", error);
    throw error;
  }
}


/**
 * Searches for bodies by name, ID, or document number
 * @param query The search term
 * @returns Array of matching CuerpoInhumado objects
 */
export const searchBodies = async (query: string): Promise<CuerpoInhumado[]> => {
  try {
    const response = await apiManagement.get(`/cuerposinhumados/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching bodies:', error);
    throw error;
  }
};

/**
 * Gets nicho information by body ID
 * @param idCuerpo The body ID
 * @returns Nicho object or null if not assigned
 */
export const getNichoByIdCuerpo = async (idCuerpo: string): Promise<Nicho | null> => {
  try {
    const response = await apiManagement.get(`/nichoscuerpos/cuerpo/${idCuerpo}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }

    // Otros errores sí deben registrarse
    console.error('Error inesperado al obtener el nicho:', error);
    throw error;
  }
};
  