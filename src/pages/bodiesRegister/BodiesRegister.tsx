import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFileExport, FaSearch, FaFilter, FaList, FaTrash } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/utilsComponents/Input";
import { getAllBodies, deleteBodyById } from "../../services/managementService";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { CuerpoInhumado, MappedBody } from "../../models/CuerpoInhumado";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getUserId, isAuthenticated } from "../../utils/auth";
import EditBodyDialog from "../../components/dialog/EditBodyDialogProps";
import CreateBodyDialog from "@/components/dialog/CreateBodyDialogProps";

const BodiesRegister = () => {
  const [bodiesData, setBodiesData] = useState<MappedBody[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [allBodies, setAllBodies] = useState<CuerpoInhumado[]>([]);
  const [selectedBody, setSelectedBody] = useState<CuerpoInhumado | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchData = async () => {
    try {
      const data: CuerpoInhumado[] = await getAllBodies();
      setAllBodies(data);

      const mappedData: MappedBody[] = data.map((item) => ({
        id: item.idCadaver,
        name: `${item.nombre} ${item.apellido}`,
        date: item.fechaIngreso,
        state: item.estado,
        document: item.documentoIdentidad,
        description: item.observaciones || "Sin observaciones",
      }));
      setBodiesData(mappedData);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  const filteredData = bodiesData.filter((item) => {
    const searchTerm = normalizeText(search);
    return (
      (filterType === "All" || item.state === filterType) &&
      (
        normalizeText(item.name).includes(searchTerm) ||
        normalizeText(item.document).includes(searchTerm)
      )
    );
  });

  // Calcular datos paginados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el cuerpo de manera permanente.',
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
        await deleteBodyById(id);
        Swal.fire('Eliminado', 'El cuerpo ha sido eliminado exitosamente.', 'success');
        fetchData(); // Solo confía en fetchData para actualizar el estado
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error', `Ocurrió un error al eliminar: ${errorMessage}`, 'error');
      }
    }
  };

  const handleUpdate = async (message: string, type: string) => {
    await Swal.fire({
      title: type === 'success' ? 'Actualización Exitosa' : 'Error en la Actualización',
      text: message,
      icon: type === 'success' ? 'success' : 'error',
      confirmButtonText: 'Ok'
    });
    if (type === 'success') {
      fetchData();
    }
  };

  const handleCreate = async (message: string, type: string) => {
    await Swal.fire({
      title: type === 'success' ? 'Creación Exitosa' : 'Error en la Creación',
      text: message,
      icon: type === 'success' ? 'success' : 'error',
      confirmButtonText: 'Ok'
    });
    if (type === 'success') {
      fetchData();
    }
  };

  const handleViewDetails = (id: string) => {
    const fullBody = allBodies.find((body) => body.idCadaver === id);
    if (fullBody) {
      setSelectedBody(fullBody);
      setShowModal(true);
    }
  };

  const handleExport = async () => {
    if (!isAuthenticated()) {
      Swal.fire('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`http://localhost:8083/reportes/descargar-cuerpos?usuarioId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al exportar la lista de cuerpos');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "lista-cuerpos.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire('Éxito', 'La lista de cuerpos ha sido exportada exitosamente.', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al exportar la lista de cuerpos:', error);
      Swal.fire('Error', `Ocurrió un error al exportar la lista: ${errorMessage}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para formatear fechas de manera legible
  const formatDate = (date: Date | string | null): string => {
    if (!date) return "No fecha";
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "Fecha inválida";
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold">Admisiones del cuerpo</h2>
      <p className="text-gray-500">Registros de ingresos recientes de cuerpos al cementerio</p>

      <div className="flex justify-between items-center mt-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search records..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Resetear a la primera página al buscar
            }}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center space-x-2 bg-blue-700 border px-4 py-2">
              <FaFilter />
              <span>{filterType === "All" ? "Todos" : filterType}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => {
              setFilterType("All");
              setCurrentPage(1); // Resetear a la primera página al cambiar filtro
            }}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setFilterType("INHUMADO");
              setCurrentPage(1);
            }}>Inhumado</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setFilterType("EXHUMADO");
              setCurrentPage(1);
            }}>Exhumado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <CreateBodyDialog
              onCreate={handleCreate}
            />
            <Button
              className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 hover:underline hover:bg-blue-500"
              onClick={handleExport}
            >
              <FaFileExport />
              <span>Exportar</span>
            </Button>
          </div>
          {isGenerating && (
            <p className="text-sm text-gray-500">El archivo se está generando...</p>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <Table className="w-full border rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha Ingreso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.state === "INHUMADO" ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
                    }`}
                  >
                    {item.state}
                  </span>
                </TableCell>
                <TableCell>{item.document}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="flex gap-1">
                  <Button
                    className="bg-blue-600 hover:underline hover:bg-blue-400 transition"
                    onClick={() => handleViewDetails(item.id)}
                  >Ver</Button>
                  <EditBodyDialog
                    body={allBodies.find((body) => body.idCadaver === item.id)!}
                    onUpdate={handleUpdate}
                  />
                  <Button
                    size='icon'
                    className="bg-red-600 text-white hover:underline hover:bg-red-400 transition"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </Button>
                  <Link to={`events/${item.id}`}>
                    <Button size='icon' className="bg-green-600 text-white hover:underline hover:bg-green-400 transition">
                      <FaList className="size-5" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-gray-500 mt-4">
        <span>
          Mostrando {startIndex + 1} -{" "}
          {endIndex > filteredData.length ? filteredData.length : endIndex} de{" "}
          {filteredData.length}
        </span>
        <div className="flex space-x-2">
          <Button
            className="text-white bg-blue-700 px-3 py-1 rounded-lg hover:underline hover:bg-blue-500"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            className="text-white bg-blue-700 px-3 py-1 rounded-lg hover:underline hover:bg-blue-500"
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {showModal && selectedBody && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-8 text-center">Detalles del Cuerpo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Nombre:</strong> {selectedBody.nombre} {selectedBody.apellido}</p>
              <p><strong>Documento:</strong> {selectedBody.documentoIdentidad}</p>
              <p><strong>Protocolo Necropsia:</strong> {selectedBody.numeroProtocoloNecropsia}</p>
              <p><strong>Causa de Muerte:</strong> {selectedBody.causaMuerte}</p>
              <p><strong>Fecha de Nacimiento:</strong> {formatDate(selectedBody.fechaNacimiento)}</p>
              <p><strong>Fecha de Defunción:</strong> {formatDate(selectedBody.fechaDefuncion)}</p>
              <p><strong>Fecha de Ingreso:</strong> {formatDate(selectedBody.fechaIngreso)}</p>
              <p><strong>Fecha de Inhumación:</strong> {formatDate(selectedBody.fechaInhumacion)}</p>
              <p><strong>Fecha de Exhumación:</strong> {formatDate(selectedBody.fechaExhumacion)}</p>
              <p><strong>Funcionario Receptor:</strong> {selectedBody.funcionarioReceptor} ({selectedBody.cargoFuncionario})</p>
              <p><strong>Autoridad Remitente:</strong> {selectedBody.autoridadRemitente} ({selectedBody.cargoAutoridadRemitente})</p>
              <p><strong>Autoridad Exhumación:</strong> {selectedBody.autoridadExhumacion} ({selectedBody.cargoAutoridadExhumacion})</p>
              <p><strong>Estado:</strong> {selectedBody.estado}</p>
              <p className="col-span-2"><strong>Observaciones:</strong> {selectedBody.observaciones}</p>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BodiesRegister;