import { Nicho } from "../../models/Nicho";

export const getNicheStyle = (estado: string) => {
  switch (estado) {
    case "OCUPADO":
      return "bg-red-300 text-red-900 hover:bg-red-400";
    case "DISPONIBLE":
      return "border-dashed border-gray-400 bg-gray-50 hover:bg-gray-200";
    case "MANTENIMIENTO":
      return "bg-yellow-300 text-yellow-900 hover:bg-yellow-400";
    default:
      return "bg-gray-300 text-gray-900";
  }
};

// Función para extraer el número del nicho de la ubicación
export const getOnlyNicheNumber = (ubicacion: string) => {
  const match = ubicacion.match(/Nicho (\d+)/);
  return match ? match[1] : "";
};

// Función para extraer el número del nicho de la ubicación
export const getNicheNumber = (ubicacion: string) => {
  const match = ubicacion.match(/Nicho\s+(\d+[A-Za-z]*)/i);
  return match ? match[1] : ubicacion;
};

export const printNichos = (nichos: Nicho[]) => {
  console.log("Nichos:", nichos);
  nichos.forEach((nicho) => {
    console.log(`Código: ${nicho.codigo}, Ubicación: ${nicho.ubicacion}, Estado: ${nicho.estado}`);
  });
};

export const sortNichosByNumber = (nichos: Nicho[]): Nicho[] => {
  return [...nichos].sort((a, b) => {
    const numA = getNicheNumber(a.ubicacion);
    const numB = getNicheNumber(b.ubicacion);

    // Intentamos comparar como número, si no, comparamos como string
    const parsedA = parseInt(numA);
    const parsedB = parseInt(numB);

    if (!isNaN(parsedA) && !isNaN(parsedB)) {
      return parsedA - parsedB;
    }

    return numA.localeCompare(numB, undefined, { numeric: true });
  });

  console.log
};

export const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "No disponible";
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString;
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return "Formato inválido";
    }
};