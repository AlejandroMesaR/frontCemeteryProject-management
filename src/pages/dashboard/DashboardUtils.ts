import { Nicho } from '../../models/Nicho';
import { CuerpoInhumado } from '../../models/CuerpoInhumado';
import { getNichoByIdCuerpo } from '../../services/managementService';

// Función para generar clase de color según el porcentaje de ocupación
export const getOccupancyColorClass = (percentage: number) => {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 70) return 'text-amber-500';
  return 'text-green-600';
};

export const getNichoByCuerpo = (cuerpo: CuerpoInhumado) => {
  if (cuerpo) {
    try {
      const response = getNichoByIdCuerpo(cuerpo.idCadaver);
      console.log("Nicho encontrado:", response);

    }catch (error) {
      console.error("Error al obtener el nicho por id de cuerpo:", error);
      return null;
    }
  }
}