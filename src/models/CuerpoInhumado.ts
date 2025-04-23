export interface CuerpoInhumado {
  idCadaver: string;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  numeroProtocoloNecropsia: string;
  causaMuerte: string;
  fechaNacimiento: string;
  fechaDefuncion: Date;
  fechaIngreso: string;
  fechaInhumacion: string;
  fechaExhumacion: string;
  funcionarioReceptor: string;
  cargoFuncionario: string;
  autoridadRemitente: string;
  cargoAutoridadRemitente: string;
  autoridadExhumacion: string;
  cargoAutoridadExhumacion: string;
  estado: string;
  observaciones: string;
  }

  export interface MappedBody {
    id: string;
    name: string;
    date: string;
    state: string;
    document: string;
    description: string;
  }