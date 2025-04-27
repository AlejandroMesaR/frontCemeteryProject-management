
export interface Nicho {
  codigo: string;
  ubicacion: string;
  estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
}

export interface AssignNichoDialogProps {
  trigger: React.ReactNode;
  onAssigned: (message:string) => Promise<void>; // callback para refrescar datos
}