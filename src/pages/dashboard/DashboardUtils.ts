// Función para generar clase de color según el porcentaje de ocupación
export const getOccupancyColorClass = (percentage: number) => {
  if (percentage >= 90) return 'text-red-600';
  if (percentage >= 70) return 'text-amber-500';
  return 'text-green-600';
};