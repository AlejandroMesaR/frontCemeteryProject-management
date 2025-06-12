import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import Dashboard from '../../pages/dashboard/Dashboard'; 
import * as managementService from '../../services/managementService';
import { CuerpoInhumado, Nicho } from '@/models';

// Mock de los servicios
vi.mock('../../services/managementService', () => ({
  getAllBodies: vi.fn(),
  getAllNichos: vi.fn(),
  getAvailableNichos: vi.fn(),
  searchBodies: vi.fn(),
  getNichoByIdCuerpo: vi.fn(),
}));

// Mock de SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('Dashboard Component', () => {
  // Datos de prueba
  const mockBodies: CuerpoInhumado[] = [
    {
      idCadaver: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      documentoIdentidad: '123456',
      numeroProtocoloNecropsia: 'N123',
      causaMuerte: 'Natural',
      fechaNacimiento: new Date('1980-01-01'),
      fechaDefuncion: new Date('2022-12-29'),
      fechaIngreso: new Date('2022-12-30'),
      fechaInhumacion: new Date('2023-01-03'),
      fechaExhumacion: new Date(''),
      funcionarioReceptor: 'Ana Gómez',
      cargoFuncionario: 'Recepcionista',
      autoridadRemitente: 'Juez',
      cargoAutoridadRemitente: 'Magistrado',
      autoridadExhumacion: '',
      cargoAutoridadExhumacion: '',
      estado: 'Inhumado',
      observaciones: '',
    },
  ];

  const mockNichos: Nicho[] = [
    { codigo: 'N1', ubicacion: 'Sector A', estado: 'OCUPADO' },
    { codigo: 'N2', ubicacion: 'Sector B', estado: 'DISPONIBLE' },
  ];

  const mockAvailableNichos: Nicho[] = [
    { codigo: 'N2', ubicacion: 'Sector B', estado: 'DISPONIBLE' },
  ];

  const mockNicho: Nicho = {
    codigo: 'N1',
    ubicacion: 'Sector A',
    estado: 'OCUPADO',
  };

  beforeEach(() => {
    // Configurar mocks antes de cada prueba
    vi.mocked(managementService.getAllBodies).mockResolvedValue(mockBodies);
    vi.mocked(managementService.getAllNichos).mockResolvedValue(mockNichos);
    vi.mocked(managementService.getAvailableNichos).mockResolvedValue(mockAvailableNichos);
    vi.mocked(managementService.searchBodies).mockResolvedValue([]);
    vi.mocked(managementService.getNichoByIdCuerpo).mockResolvedValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('DB-01: Renderiza el componente sin errores', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Bienvenido al sistema de gestión de cementerios/i)).toBeInTheDocument();
  });

  test('DB-01: Renderiza las estadísticas correctamente', async () => {
    render(<Dashboard />);

    // Esperar a que las estadísticas se rendericen
    await waitFor(() => {
      expect(screen.getByText('Cuerpos Registrados')).toBeInTheDocument();
      expect(screen.getByText('Nichos Disponibles')).toBeInTheDocument();
      expect(screen.getByText('Ocupación')).toBeInTheDocument();
    });
  });

  test('DB-01: Muestra cards con totales correctamente', async () => {
    render(<Dashboard />);

    // Esperar a que los datos se carguen
    await waitFor(() => {
      // Verificar total de cuerpos
      const bodiesCard = screen.getByTestId('cuerpos-card');
      expect(within(bodiesCard).getByText('1')).toBeInTheDocument(); // totalCuerpos = 1

      // Verificar nichos disponibles y disponibilidad
      const nichosCard = screen.getByTestId('nichos-card');
      expect(within(nichosCard).getByText('1')).toBeInTheDocument(); // nichosDisponibles = 1
      expect(within(nichosCard).getByText('De 2 totales')).toBeInTheDocument(); // totalNichos = 2
      expect(within(nichosCard).getByText('50%')).toBeInTheDocument(); // disponibilidad = 50%

      // Verificar porcentaje de ocupación
      const ocupacionCard = screen.getByTestId('ocupacion-card');
      expect(within(ocupacionCard).getByText('50%')).toBeInTheDocument(); // porcentajeOcupacion = 50%
      expect(within(ocupacionCard).getByText('Óptimo')).toBeInTheDocument(); // estado de ocupación
    });
  });

  test('DB-02: Búsqueda válida - Buscar cuerpo existente renderiza resultados y detalles', async () => {
    // Configurar mock para búsqueda
    vi.mocked(managementService.searchBodies).mockResolvedValue(mockBodies);
    vi.mocked(managementService.getNichoByIdCuerpo).mockResolvedValue(mockNicho);

    // Renderizar componente
    render(<Dashboard />);

    // Simular escritura en el campo de búsqueda
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre, cédula o código/i);
    fireEvent.change(searchInput, { target: { value: 'Juan' } });

    // Esperar a que los resultados de búsqueda se rendericen
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Inhumado')).toBeInTheDocument();
      expect(screen.getByText('ID: 1')).toBeInTheDocument();
      // Depurar los datos mockeados
      console.log('searchBodies result:', mockBodies);
    });

    // Simular clic en el resultado para seleccionar el cuerpo
    const resultCard = screen.getByText('Juan Pérez').closest('.hover\\:bg-gray-50') as HTMLElement;
    fireEvent.click(resultCard);

    // Esperar a que los detalles del cuerpo se rendericen
    await waitFor(() => {
      const detailsCard = screen.getByText('Información del Cuerpo').closest('.bg-gray-50') as HTMLElement;
      
      // Verificar detalles del cuerpo
      expect(within(detailsCard).getByText('Juan Pérez')).toBeInTheDocument();
      expect(within(detailsCard).getByText('Natural')).toBeInTheDocument(); // causaMuerte
      expect(within(detailsCard).getByText('29/12/2022')).toBeInTheDocument(); // fechaDefuncion
      expect(within(detailsCard).getByText('Inhumado')).toBeInTheDocument(); // estado

      // Verificar información del nicho
      expect(within(detailsCard).getByText('Información del Nicho')).toBeInTheDocument();
      expect(within(detailsCard).getByText('N1')).toBeInTheDocument(); // codigo
      expect(within(detailsCard).getByText('Sector A')).toBeInTheDocument(); // ubicacion
    });
  });

  test('DB-03: Búsqueda sin resultados - Muestra mensaje “No se encontraron resultados para ..."', async () => {
    // Configurar mock para búsqueda sin resultados
    vi.mocked(managementService.searchBodies).mockResolvedValue([]);

    // Renderizar componente
    render(<Dashboard />);

    // Simular escritura en el campo de búsqueda con un texto inexistente
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre, cédula o código/i);
    fireEvent.change(searchInput, { target: { value: 'TextoInexistente' } });

    // Esperar a que el mensaje de "No se encontraron resultados para ..." se renderice
    await waitFor(() => {
      expect(screen.getByText('No se encontraron resultados para "TextoInexistente"')).toBeInTheDocument();
    });
  });

  test('DB-04: Cuerpo seleccionado - Clic en resultado de búsqueda carga nicho asociado', async () => {
    // Configurar mock para búsqueda y nicho
    vi.mocked(managementService.searchBodies).mockResolvedValue(mockBodies);
    vi.mocked(managementService.getNichoByIdCuerpo).mockResolvedValue(mockNicho);

    // Renderizar componente
    render(<Dashboard />);

    // Simular escritura en el campo de búsqueda
    const searchInput = screen.getByPlaceholderText(/Buscar por nombre, cédula o código/i);
    fireEvent.change(searchInput, { target: { value: 'Juan' } });

    // Esperar a que los resultados de búsqueda se rendericen
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Inhumado')).toBeInTheDocument();
      expect(screen.getByText('ID: 1')).toBeInTheDocument();
    });

    // Simular clic en el resultado para seleccionar el cuerpo
    const resultCard = screen.getByText('Juan Pérez').closest('.hover\\:bg-gray-50') as HTMLElement;
    fireEvent.click(resultCard);

    // Esperar a que los detalles del nicho se rendericen
    await waitFor(() => {
      const detailsCard = screen.getByText('Información del Nicho').closest('.bg-gray-50') as HTMLElement;
      
      // Verificar información del nicho
      expect(within(detailsCard).getByText('N1')).toBeInTheDocument(); // codigo
      expect(within(detailsCard).getByText('Sector A')).toBeInTheDocument(); // ubicacion

      // Verificar que se llamó al servicio para obtener el nicho
      expect(managementService.getNichoByIdCuerpo).toHaveBeenCalledWith('1');
    });
  });
});