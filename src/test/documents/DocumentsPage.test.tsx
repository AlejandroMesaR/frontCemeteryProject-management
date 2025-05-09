import { render, screen, waitFor, within } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import DocumentsPage from '../../pages/documents/DocumentsPage';
import * as documentService from '../../services/documentService';
import Swal from 'sweetalert2';
import { Documento } from '../../models/Documento';

// Mock de los servicios
vi.mock('../../services/documentService', () => ({
  getAllDocuments: vi.fn(),
  deleteDocument: vi.fn(),
}));

// Mock de SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock de auth utils
vi.mock('../../utils/auth', () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
  getUserId: vi.fn().mockReturnValue('user123'),
}));

// Mock de fetch
global.fetch = vi.fn();

describe('DocumentsPage Component', () => {
  const mockDocuments: Documento[] = [
    {
      id: '1',
      nombre: 'Reporte Mensual',
      fechaGeneracion: '2025-05-01T12:00:00Z',
      tipo: 'REPORTE',
      usuarioId: 'user123',
    },
    {
      id: '2',
      nombre: 'Digitalización 2024',
      fechaGeneracion: '2025-04-15T09:00:00Z',
      tipo: 'DIGITALIZACION',
      usuarioId: 'user456',
    },
  ];

  beforeEach(() => {
    vi.mocked(documentService.getAllDocuments).mockResolvedValue(mockDocuments);
    vi.mocked(documentService.deleteDocument).mockResolvedValue(undefined);

    // Mock de window.URL
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:http://localhost:8083/mock-blob');
    const mockRevokeObjectURL = vi.fn();
    vi.stubGlobal('URL', {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });

    // Mock de fetch
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(new Blob(['mocked content'], { type: 'application/pdf' })),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: 'http://localhost:8083/reportes/descargar?usuarioId=user123',
      body: null,
      bodyUsed: false,
      clone: vi.fn(),
      arrayBuffer: vi.fn(),
      formData: vi.fn(),
      json: vi.fn(),
      text: vi.fn(),
    } as unknown as Response);

    // Mock de localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    vi.spyOn(Storage.prototype, 'getItem').mockRestore();
  });

  test('DP-01: Render inicial - Carga documentos del sistema', async () => {
    render(<DocumentsPage />);
    await waitFor(() => {
      expect(screen.getByText('Registro de Documentos')).toBeInTheDocument();
      expect(screen.getByText('Reporte Mensual')).toBeInTheDocument();
      expect(screen.getByText('Digitalización 2024')).toBeInTheDocument();
    });
  });

  test('DP-02: Búsqueda - Filtrar por título de documento', async () => {
    render(<DocumentsPage />);
    const searchInput = screen.getByPlaceholderText(/Buscar registros/i);
    await userEvent.type(searchInput, 'Reporte');
    await waitFor(() => {
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBe(2); // Header + 1 row (Reporte Mensual)
      expect(within(rows[1]).getByText('Reporte Mensual')).toBeInTheDocument();
      expect(within(table).queryByText('Digitalización 2024')).toBeNull();
    });
  });

  test('DP-03: Filtrar por tipo - Elegir tipo REPORTE', async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    // Abrir el menú
    const filterButton = screen.getByRole('button', { name: /Todos/i });
    await user.click(filterButton);

    // Esperar a que la opción "Reporte" esté visible y hacer clic
    await waitFor(() => {
      const reportType = screen.getByRole('menuitem', { name: /Reporte/i });
      expect(reportType).toBeInTheDocument();
      user.click(reportType);
    }, { timeout: 2000 });

    // Verificar que el botón de filtro muestre "REPORTE"
    await waitFor(() => {
      const filterButton = screen.getByRole('button', {
        name: /^REPORTE$/i,
      });
      expect(filterButton).toBeInTheDocument();
    }, { timeout: 2000 });

    // Verificar que la tabla se actualice correctamente
    await waitFor(() => {
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      expect(rows.length).toBe(2); // Header + 1 row (Reporte Mensual)
      expect(within(rows[1]).getByText('Reporte Mensual')).toBeInTheDocument();
      expect(within(table).queryByText('Digitalización 2024')).toBeNull();
    }, { timeout: 2000 });
  });

  test('DP-04: Descargar - Simular descarga y validación', async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);
    const downloadButton = screen.getByRole('button', { name: /Descargar Reporte/i });
    await user.click(downloadButton);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8083/reportes/descargar?usuarioId=user123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/pdf',
            'Authorization': expect.stringContaining('Bearer '),
          }),
        })
      );
      expect(Swal.fire).toHaveBeenCalledWith('Éxito', 'El documento ha sido descargado exitosamente.', 'success');
    });
  });
});