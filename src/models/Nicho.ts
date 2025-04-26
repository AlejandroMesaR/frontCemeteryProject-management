import { CuerpoInhumado } from "./CuerpoInhumado";

export interface Nicho {
  codigo: string;
  ubicacion: string;
  estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
}

export interface AssignNichoDialogProps {
  trigger: React.ReactNode;
  nichos: Nicho[];
  cuerpos: CuerpoInhumado[];
  onAssigned: () => Promise<void>; // callback para refrescar datos
}