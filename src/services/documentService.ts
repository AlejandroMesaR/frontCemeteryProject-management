import { apiDocuments } from '../api/axios';
import { Documento } from '../models/Documento';

export const getAllDocuments = async (): Promise<Documento[]> => {
  try {
    const response = await apiDocuments.get('/reportes'); // Cambiar /documentos por /reportes
    return response.data;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<void> => {
  try {
    await apiDocuments.delete(`/reportes/${id}`); // Cambiar /documentos por /reportes
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
};

export const createDocument = async (documento: Omit<Documento, 'id'>): Promise<Documento> => {
  try {
    const response = await apiDocuments.post('/reportes', documento); // Cambiar /documentos por /reportes
    return response.data;
  } catch (error) {
    console.error('Error al crear documento:', error);
    throw error;
  }
};