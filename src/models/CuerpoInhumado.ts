export interface CuerpoInhumado {
  idCadaver: string;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  numeroProtocoloNecropsia: string;
  causaMuerte: string;
  fechaNacimiento: Date;
  fechaDefuncion: Date;
  fechaIngreso: Date;
  fechaInhumacion: Date;
  fechaExhumacion: Date;
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
    date: Date;
    state: string;
    document: string;
    description: string;
  }