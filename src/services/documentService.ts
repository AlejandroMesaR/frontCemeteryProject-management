import { apiDocuments } from '../api/axios';
import { Documento } from '../models/Documento';

export const getAllDocuments = async (): Promise<Documento[]> => {
  try {
    const response = await apiDocuments.get('/reportes');
    return response.data;
  } catch (error) {
    console.error("Error al obtener los documentos:", error);
    throw error;
  }
};

export const getDocumentById = async (id: string): Promise<Documento> => {
  try {
    const response = await apiDocuments.get(`/reportes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el documento con id ${id}:`, error);
    throw error;
  }
};

export const createDocument = async (documentData: Omit<Documento, 'id'>): Promise<Documento> => {
  try {
    const response = await apiDocuments.post('/reportes', documentData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el documento:", error);
    throw error;
  }
};

export const updateDocument = async (id: string, documentData: Documento): Promise<Documento> => {
  try {
    const response = await apiDocuments.put(`/reportes/${id}`, documentData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el documento con id ${id}:`, error);
    throw error;
  }
};

export const deleteDocument = async (id: string): Promise<boolean> => {
  try {
    const response = await apiDocuments.delete(`/reportes/${id}`);
    return response.status === 204;
  } catch (error) {
    console.error(`Error al eliminar el documento con id ${id}:`, error);
    throw error;
  }
};