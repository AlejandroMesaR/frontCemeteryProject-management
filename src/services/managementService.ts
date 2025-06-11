import { NichoCuerpoCreate } from '@/models/NichoCuerpo';
import { apiManagement } from '../api/axios';
import { CuerpoInhumado } from "../models/CuerpoInhumado";
import { Nicho } from "../models/Nicho";
import { EventoCuerpo } from '../models/EventoCuerpo';
import { EventoCuerpoUpdate } from '@/models';

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

export const updateBody = async (idCadaver: string, updatedData: Partial<CuerpoInhumado>) => {
  try {
    const response = await apiManagement.put(`/cuerposinhumados/${idCadaver}`, updatedData);
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
    return response.data;
  } catch (error) {
    console.error("Error al obtener el cuerpo inhumado por nicho:", error);
    throw error;
  }
};

export const createNichoCuerpo = async (payload: NichoCuerpoCreate) => {
  try {
    const response = await apiManagement.post("/nichoscuerpos", payload);
    return response.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      `Error al asignar nicho (status ${err.response?.status})`;
    throw new Error(message);
  }
};

export const releaseNicho = async (codigoNicho: string) => {
  const relacion = await apiManagement.get(`/nichoscuerpos/nichoByID/${codigoNicho}`);
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
      params: {
        estado: nuevoEstado
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estado del nicho:", error);
    throw error;
  }
};

export const getLastBodiesIngress = async (cantidad: number) => {
  try {
    const response = await apiManagement.get('/cuerposinhumados/ultimos', {
      params: {
        cantidad: cantidad
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el último ingreso:", error);
    throw error;
  }
};

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
    console.error('Error inesperado al obtener el nicho:', error);
    throw error;
  }
};

/**
 * Gets all events for a specific body by its ID
 * @param idCadaver The body ID
 * @returns Array of EventoCuerpo objects
 */
export const getEventsByBodyId = async (idCadaver: string): Promise<EventoCuerpo[]> => {
  try {
    const response = await apiManagement.get(`/eventoscuerpos/cuerpo/${idCadaver}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Error al obtener los eventos del cuerpo (status ${error.response?.status})`;
    throw new Error(message);
  }
};

/**
 * Creates a new event for a specific body
 * @param eventData The event data
 * @returns The created EventoCuerpo object
 */
export const createEvent = async (eventData: Omit<EventoCuerpo, "id">): Promise<EventoCuerpo> => {
  try {
    const response = await apiManagement.post('/eventoscuerpos', eventData);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Error al crear el evento (status ${error.response?.status})`;
    throw new Error(message);
  }
};

export const createEventFile = async (formData: FormData): Promise<EventoCuerpo> => {
  try {
    const response = await apiManagement.post<EventoCuerpo>("/eventoscuerpos", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || `HTTP error! Status: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};

/**
 * Updates an existing event
 * @param id The event ID
 * @param eventData The updated event data
 * @returns The updated EventoCuerpo object
 */
export const updateEvent = async (id: string, eventData: Partial<EventoCuerpoUpdate>): Promise<EventoCuerpo> => {
  try {
    const response = await apiManagement.put(`/eventoscuerpos/${id}`, eventData);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Error al actualizar el evento (status ${error.response?.status})`;
    throw new Error(message);
  }
};

/**
 * Deletes an event by its ID
 * @param id The event ID
 * @returns True if deletion was successful
 */
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const response = await apiManagement.delete(`/eventoscuerpos/${id}`);
    return response.status === 204;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Error al eliminar el evento (status ${error.response?.status})`;
    throw new Error(message);
  }
};

/**
 * Gets a body by its ID
 * @param idCadaver The body ID
 * @returns The CuerpoInhumado object
 */
export const getBodyById = async (idCadaver: string): Promise<CuerpoInhumado> => {
  try {
    const response = await apiManagement.get(`/cuerposinhumados/${idCadaver}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      `Error al obtener el cuerpo por ID (status ${error.response?.status})`;
    throw new Error(message);
  }
};

/**
 * Uploads a document to the /cuerposinhumados/from-form endpoint
 * @param file The file to upload
 * @returns The created CuerpoInhumado object
 */
export const uploadDocument = async (file: File): Promise<CuerpoInhumado> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiManagement.post<CuerpoInhumado>("/cuerposinhumados/from-form", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      `Error al subir el documento (status ${error.response?.status})`;
    throw new Error(message);
  }
};

// Función para descargar archivo de Cloudinary
export const downloadCloudinaryFile = async (url: string, fileName: string): Promise<void> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al descargar: ${response.status}`);
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'archivo_descargado';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    throw new Error("No se pudo descargar el archivo");
  }
};