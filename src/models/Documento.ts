export interface Documento {
  id: string;
  nombre: string;
  fechaGeneracion: string;
  tipo: string;
  usuarioId: string;
}

export interface MappedDocument {
  id: string;
  title: string;
  date: string;
  type: string;
  relatedTo: string;
}