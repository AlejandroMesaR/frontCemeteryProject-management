export interface EventoCuerpoUpdate {
  id: string;
  idCadaver: string;
  fechaEvento: string;
  tipoEvento: string;
  resumenEvento: string;
  archivo: File | null; // Changed from File to string | null to match the backend URL
}