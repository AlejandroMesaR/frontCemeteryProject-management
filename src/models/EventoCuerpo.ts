export interface EventoCuerpo {
  id: string;
  idCadaver: string;
  fechaEvento: string;
  tipoEvento: string;
  resumenEvento: string;
  archivo: string | null; // Changed from File to string | null to match the backend URL
}