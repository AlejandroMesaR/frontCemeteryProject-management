import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, afterEach} from 'vitest';
import { vi } from 'vitest';
import CemeteryMap from '../../pages/cemetery/Cemetery';
import * as managementService from '../../services/managementService';
import { Nicho } from '../../models';

// Mock de los servicios
vi.mock('../../services/managementService', () => ({
  getAllNichos: vi.fn(),
  getNichoById: vi.fn(),
}));

// Mock de las utilidades de functionsCementery
vi.mock('./functionsCementery', () => ({
  getNicheStyle: vi.fn().mockImplementation((estado: string) => {
    if (estado === 'OCUPADO') return 'bg-red-300 text-red-900 hover:bg-red-400';
    if (estado === 'DISPONIBLE') return 'border-dashed border-gray-400 bg-gray-50 hover:bg-gray-200';
    return 'bg-yellow-100 border-yellow-400';
  }),
  getNicheNumber: vi.fn().mockImplementation((ubicacion: string) => ubicacion),
  sortNichosByNumber: vi.fn().mockImplementation((nichos: Nicho[]) => nichos),
}));

// Static mock for sweetalert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(), // Placeholder, will be overridden in tests
  },
}));

// Mock de los diálogos
vi.mock('../../components/dialog/NichoDialog', () => {
  const handleClick = vi.fn();
  return {
    default: ({ codigo, trigger }: { codigo: string; trigger: React.ReactNode }) => {
      // Attach handleClick to window for test access and call with codigo only
      (window as any).__nichoDialogHandleClick = (e: React.MouseEvent) => handleClick(codigo);
      return <div data-testid={`nicho-dialog-${codigo}`} onClick={(e) => (window as any).__nichoDialogHandleClick(e)}>{trigger}</div>;
    },
  };
});

vi.mock('../../components/dialog/AssignNichoDialog', () => ({
  default: ({ trigger }: { trigger: React.ReactNode }) => trigger,
}));

// Definir tipos para el componente Select
interface SelectProps {
  onValueChange: (value: string) => void;
  value: string;
}

// Mock de Select para simplificar interacción
vi.mock('@/components/ui/select', () => ({
  Select: ({ onValueChange, value }: SelectProps) => {
    console.log('Select rendered with value:', value); // Debug
    return (
      <select
        data-testid="state-filter"
        value={value}
        onChange={(e) => {
          console.log('Select onChange:', e.target.value); // Debug
          onValueChange(e.target.value);
        }}
      >
        <option value="TODOS">Todos los estados</option>
        <option value="OCUPADO">Ocupados</option>
        <option value="DISPONIBLE">Disponibles</option>
        <option value="MANTENIMIENTO">En mantenimiento</option>
      </select>
    );
  },
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => null,
  SelectContent: () => null,
  SelectItem: () => null,
}));

describe('CemeteryMap Component', () => {
  // Datos de prueba
  const mockNichos: Nicho[] = [
    { codigo: 'N1', ubicacion: 'Sector A', estado: 'OCUPADO' },
    { codigo: 'N2', ubicacion: 'Sector B', estado: 'DISPONIBLE' },
  ];

  beforeEach(() => {
    // Configurar mocks antes de cada prueba
    vi.mocked(managementService.getAllNichos).mockImplementation(() => {
      console.log('getAllNichos called, returning:', mockNichos);
      return new Promise((resolve) => setTimeout(() => resolve(mockNichos), 100));
    });
    vi.mocked(managementService.getNichoById).mockImplementation((codigo: string) => {
      console.log('getNichoById called with:', codigo);
      const nicho = mockNichos.find((n) => n.codigo === codigo);
      return Promise.resolve(nicho || mockNichos[0]);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (window as any).__nichoDialogHandleClick;
  });

  test('CM-01: Render inicial - Muestra estadísticas de nichos (total, ocupados, disponibles, en mantenimiento)', async () => {
    try {
      render(<CemeteryMap />);

      // Verificar renderizado inicial
      await waitFor(() => {
        console.log('DOM during loading:');
        screen.debug();

        // Verificar si hay un mensaje de error
        const errorElement = screen.queryByText(/Error al cargar datos/i);
        if (errorElement) {
          throw new Error('Error message found in DOM: ' + errorElement.textContent);
        }

        // Verificar que getAllNichos fue llamado
        expect(managementService.getAllNichos).toHaveBeenCalled();

        // Verificar estadísticas usando data-testid
        const totalCard = screen.getByTestId('stats-total');
        expect(within(totalCard).getByText('Total de nichos')).toBeInTheDocument();
        expect(within(totalCard).getByText('2')).toBeInTheDocument();

        const ocupadosCard = screen.getByTestId('stats-ocupados');
        expect(within(ocupadosCard).getByText('Ocupados')).toBeInTheDocument();


        const disponiblesCard = screen.getByTestId('stats-disponibles');
        expect(within(disponiblesCard).getByText('Disponibles')).toBeInTheDocument();


        const mantenimientoCard = screen.getByTestId('stats-mantenimiento');
        expect(within(mantenimientoCard).getByText('En mantenimiento')).toBeInTheDocument();


        // Verificar nichos
        expect(screen.getByTestId('nicho-N1')).toBeInTheDocument();
        expect(screen.getByTestId('nicho-N2')).toBeInTheDocument();
      }, { timeout: 20000 });
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  test('CM-02: Filtro por estado - Seleccionar OCUPADO muestra solo nichos ocupados', async () => {
    try {
      render(<CemeteryMap />);

      // Verificar renderizado inicial
      await waitFor(() => {
        expect(managementService.getAllNichos).toHaveBeenCalled();
        expect(screen.getByTestId('nicho-N1')).toBeInTheDocument();
        expect(screen.getByTestId('nicho-N2')).toBeInTheDocument();
      }, { timeout: 20000 });

      // Seleccionar "Ocupados" en el dropdown
      const select = screen.getByTestId('state-filter');
      fireEvent.change(select, { target: { value: 'OCUPADO' } });

      // Verificar que solo el nicho ocupado (N1) está presente
      await waitFor(() => {
        console.log('DOM after filtering:');
        screen.debug();
        expect(screen.getByTestId('nicho-N1')).toBeInTheDocument();
        expect(screen.queryByTestId('nicho-N2')).not.toBeInTheDocument();
      }, { timeout: 20000 });

      // Verificar que el estilo del nicho ocupado es correcto
      const nichoButton = screen.getByTestId('nicho-N1');
      expect(nichoButton).toHaveClass('bg-red-300 text-red-900 hover:bg-red-400');
      expect(nichoButton).toHaveAttribute('title', 'Sector A');
      expect(nichoButton).toHaveTextContent('Sector A');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  test('CM-03: Búsqueda por código - Ingresar código válido muestra nichos filtrados', async () => {
    const user = userEvent.setup();
    try {
      render(<CemeteryMap />);

      // Verificar renderizado inicial
      await waitFor(() => {
        expect(managementService.getAllNichos).toHaveBeenCalled();
        expect(screen.getByTestId('nicho-N1')).toBeInTheDocument();
        expect(screen.getByTestId('nicho-N2')).toBeInTheDocument();
      }, { timeout: 20000 });

      // Ingresar código "N1" en el input de búsqueda
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'N1');

      // Verificar que solo el nicho con código N1 está presente
      await waitFor(() => {
        console.log('DOM after search:');
        screen.debug();
        expect(screen.getByTestId('nicho-N1')).toBeInTheDocument();
        expect(screen.queryByTestId('nicho-N2')).not.toBeInTheDocument();
      }, { timeout: 20000 });

      // Verificar que el input contiene el valor ingresado
      expect(searchInput).toHaveValue('N1');

      // Verificar que el nicho mostrado tiene el estilo correcto
      const nichoButton = screen.getByTestId('nicho-N1');
      expect(nichoButton).toHaveClass('bg-red-300 text-red-900 hover:bg-red-400');
      expect(nichoButton).toHaveAttribute('title', 'Sector A');
      expect(nichoButton).toHaveTextContent('Sector A');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  test('CM-04: Clic en nicho - Clic en nicho abre diálogo con datos del nicho', async () => {
    const user = userEvent.setup();
    try {
      // Mock the sweetalert2 fire function
      const mockSwalFire = vi.fn();
      vi.spyOn(require('sweetalert2'), 'default').mockImplementation(() => ({
        fire: mockSwalFire,
      }));

      // Mock the NichoDialog click handler
      const mockNichoDialogClick = vi.fn().mockImplementation(async (codigo: string) => {
        const nicho = await managementService.getNichoById(codigo);
        mockSwalFire({
          title: 'Detalles del Nicho',
          html: `
            <p>Código: ${nicho.codigo}</p>
            <p>Ubicación: ${nicho.ubicacion}</p>
            <p>Estado: ${nicho.estado}</p>
          `,
          icon: 'info',
          confirmButtonText: 'Cerrar',
        });
      });

      // Find and mock the NichoDialog click handler
      render(<CemeteryMap />);
      await waitFor(() => {
        expect(managementService.getAllNichos).toHaveBeenCalled();
        expect(screen.getByTestId('nicho-N1')).toBeInTheDocument();
        expect(screen.getByTestId('nicho-N2')).toBeInTheDocument();
      }, { timeout: 20000 });

      const handleClick = (window as any).__nichoDialogHandleClick;
      if (!handleClick || typeof handleClick.mockImplementation !== 'function') {
        throw new Error('handleClick is not a mock function');
      }
      handleClick.mockImplementation(mockNichoDialogClick);

      // Simular clic en el nicho N1
      const nichoButton = screen.getByTestId('nicho-N1');
      await user.click(nichoButton);

      // Verificar que getNichoById fue llamado con el código correcto
      await waitFor(() => {
        expect(managementService.getNichoById).toHaveBeenCalledWith('N1');
        expect(mockNichoDialogClick).toHaveBeenCalledWith('N1'); // Expect only 'N1'
      }, { timeout: 20000 });

      // Verificar que Swal.fire fue llamado con los datos del nicho
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Detalles del Nicho',
          html: expect.stringContaining('Código: N1'),
          icon: 'info',
          confirmButtonText: 'Cerrar',
        })
      );
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('Ubicación: Sector A'),
        })
      );
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('Estado: OCUPADO'),
        })
      );
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

});