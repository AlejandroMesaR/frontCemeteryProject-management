export interface Documento {
    id: string;
    nombre: string;
    fechaGeneracion: string; // LocalDateTime en el backend, pero lo manejaremos como string en el frontend
    tipo: string; // Podría ser un enum si conocemos todos los valores posibles (por ejemplo, "REPORTE")
    usuarioId: string;
  }
  
  export interface MappedDocument {
    id: string;
    title: string;
    date: string;
    type: string;
    relatedTo: string; // usuarioId o un nombre relacionado
    status: string; // Podríamos derivarlo de otros campos si es necesario
  }