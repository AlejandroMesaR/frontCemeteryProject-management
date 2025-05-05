import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/utilsComponents/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { getAllDocuments, deleteDocument } from "../../services/documentService";
import { Documento, MappedDocument } from "../../models/Documento";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { FaFilter } from 'react-icons/fa';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { getUserId, isAuthenticated } from '../../utils/auth';

export default function DocumentsPage() {
  const [documentsData, setDocumentsData] = useState<MappedDocument[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // Estado para controlar el mensaje de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Documento[] = await getAllDocuments();
        const mappedData: MappedDocument[] = data.map((item) => ({
          id: item.id,
          title: item.nombre,
          date: item.fechaGeneracion,
          type: item.tipo,
          relatedTo: item.usuarioId,
        }));
        setDocumentsData(mappedData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error al cargar documentos:', error);
        Swal.fire('Error', `No se pudieron cargar los documentos: ${errorMessage}`, 'error');
      }
    };

    fetchData();
  }, []);

  // Normalizar texto para búsqueda
  function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Formatear fecha sin hora
  function formatDateWithoutTime(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const filteredDocuments = documentsData.filter((doc) => {
    const searchTerm = normalizeText(search);
    return (
      (filterType === "All" || doc.type === filterType) &&
      normalizeText(doc.title).includes(searchTerm)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Cambiar a 10 documentos por página
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredDocuments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro de descarga de manera permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded mr-2',
        cancelButton: 'bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await deleteDocument(id);
        Swal.fire('Eliminado', 'El registro ha sido eliminado exitosamente.', 'success');
        setDocumentsData((prev) => prev.filter((item) => item.id !== id));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error', `Ocurrió un error al eliminar: ${errorMessage}`, 'error');
      }
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated()) {
      Swal.fire('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    setIsGenerating(true); // Mostrar el mensaje de carga

    try {
      const response = await fetch(`http://localhost:8083/reportes/descargar?usuarioId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar el documento');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Refrescar la lista de documentos (el backend ya crea el registro)
      const data: Documento[] = await getAllDocuments();
      const mappedData: MappedDocument[] = data.map((item) => ({
        id: item.id,
        title: item.nombre,
        date: item.fechaGeneracion,
        type: item.tipo,
        relatedTo: item.usuarioId,
      }));
      setDocumentsData(mappedData);

      Swal.fire('Éxito', 'El documento ha sido descargado exitosamente.', 'success');
      setIsGenerating(false); // Ocultar el mensaje de carga después del pop-up
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Swal.fire('Error', `Ocurrió un error al descargar el documento: ${errorMessage}`, 'error');
      setIsGenerating(false); // Ocultar el mensaje de carga después del pop-up
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="">
        <h2 className="text-xl font-semibold">Registro de Documentos</h2>
        <p className="text-gray-500 text-sm">Historial de documentos del sistema</p>
        <div className="mt-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar registros..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center space-x-2 bg-blue-700 border px-4 py-2 text-white hover:bg-blue-500">
                <FaFilter />
                <span>{filterType === "All" ? "Todos" : filterType}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType("All")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("REPORTE")}>Reporte</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("DIGITALIZACION")}>Digitalización</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col gap-1">
            {isGenerating && (
                <p className="text-sm text-gray-500">El archivo se está generando...</p>
              )}
            <Button
              className="bg-green-200 text-green-700 hover:bg-green-300"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-1" /> Descargar Reporte
            </Button>
          </div>
        </div>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de Descarga</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{formatDateWithoutTime(doc.date)}</TableCell>
              <TableCell>{doc.relatedTo}</TableCell>
              <TableCell>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-200">{doc.type}</span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  className="bg-red-600 text-white hover:underline hover:bg-red-400 transition"
                  onClick={() => handleDelete(doc.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center text-gray-500 mt-4">
        <span>
          Mostrando {startIndex + 1} -{" "}
          {endIndex > filteredDocuments.length ? filteredDocuments.length : endIndex} de{" "}
          {filteredDocuments.length}
        </span>
        <div className="flex space-x-2">
          <Button
            className="text-white bg-blue-700 px-3 py-1 rounded-lg hover:underline hover:bg-blue-500"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            className="text-white bg-blue-700 px-3 py-1 rounded-lg hover:underline hover:bg-blue-500"
            onClick={() =>
              setCurrentPage((prev) =>
                prev < totalPages ? prev + 1 : prev
              )
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}