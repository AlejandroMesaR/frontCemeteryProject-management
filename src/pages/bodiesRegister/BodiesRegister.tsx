import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFileExport, FaSearch, FaFilter, FaList, FaTrash } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"; 
import { Button } from "../../components/ui/button"; 
import { Input } from "../../components/utilsComponents/Input"; 
import { getAllBodies, deleteBodyById, createBody } from "../../services/managementService"; 
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
  
  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  const filteredData = bodiesData.filter((item) => {
    const searchTerm = normalizeText(search).toLowerCase();
    return (
      (filterType === "All" || item.state === filterType) &&
      (
        normalizeText(item.name).includes(searchTerm) ||
        normalizeText(item.document).includes(searchTerm)
      )
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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
        setBodiesData((prev) => prev.filter((item) => item.id !== id));
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
  };

  const handleCreate = async (message: string, type: string) => {
    await Swal.fire({
      title: type === 'success' ? 'Creación Exitosa' : 'Error en la Creación',
      text: message,
      icon: type === 'success' ? 'success' : 'error',
      confirmButtonText: 'Ok'
    });
  };


  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newBodyData, setNewBodyData] = useState<Omit<CuerpoInhumado, "idCadaver">>({
    nombre: "",
    apellido: "",
    documentoIdentidad: "",
    numeroProtocoloNecropsia: "",
    causaMuerte: "",
    fechaNacimiento: "",
    fechaDefuncion: new Date(),
    fechaIngreso: "",
    fechaInhumacion: "",
    fechaExhumacion: "",
    funcionarioReceptor: "",
    cargoFuncionario: "",
    autoridadRemitente: "",
    cargoAutoridadRemitente: "",
    autoridadExhumacion: "",
    cargoAutoridadExhumacion: "",
    estado: "",
    observaciones: "",
  });

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

      const data: CuerpoInhumado[] = await getAllBodies();
      const mappedData: MappedBody[] = data.map((item) => ({
        id: item.idCadaver,
        name: `${item.nombre} ${item.apellido}`,
        date: item.fechaIngreso,
        state: item.estado,
        document: item.documentoIdentidad,
        description: item.observaciones || "Sin observaciones",
      }));
      setBodiesData(mappedData);

      Swal.fire('Éxito', 'La lista de cuerpos ha sido exportada exitosamente.', 'success');
      setIsGenerating(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al exportar la lista de cuerpos:', error);
      Swal.fire('Error', `Ocurrió un error al exportar la lista: ${errorMessage}`, 'error');
      setIsGenerating(false);
    }
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
            onChange={(e) => setSearch(e.target.value)}
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
            <DropdownMenuItem onClick={() => setFilterType("All")}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("INHUMADO")}>Inhumado</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("EXHUMADO")}>Exhumado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <CreateBodyDialog
              onCreate={(message, type) => {
                  handleCreate(message, type);
                  fetchData();
                }}
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allBodies.map((item) => (
              <TableRow key={item.idCadaver}>
                <TableCell>{item.nombre+" "+item.apellido}</TableCell>
                <TableCell>{item.fechaIngreso}</TableCell> 
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.estado === "Inhumado" ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
                    }`}
                  >
                    {item.estado}
                  </span>
                </TableCell>
                <TableCell>{item.documentoIdentidad}</TableCell>
                <TableCell>{item.observaciones}</TableCell> 
                <TableCell className="flex gap-1">
                  <Button 
                    className="bg-blue-600 hover:underline hover:bg-blue-400 transition"
                    onClick={() => handleViewDetails(item.idCadaver)}
                  >Ver</Button>
                  <EditBodyDialog
                      body={item}
                      onUpdate={(message, type) => {
                        handleUpdate(message, type);
                        fetchData();
                      }}
                  />
                  <Button
                    size='icon'
                    className="bg-red-600 text-white hover:underline hover:bg-red-400 transition"
                    onClick={() => handleDelete(item.idCadaver)}>
                      <FaTrash />
                  </Button>
                  <Link to={`events/${item.idCadaver}`}>
                    <Button size='icon' className="bg-green-600 text-white hover:underline hover:bg-green-400 transition" >
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

      {showModal && selectedBody && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-8 text-center">Detalles del Cuerpo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Nombre:</strong> {selectedBody.nombre} {selectedBody.apellido}</p>
              <p><strong>Documento:</strong> {selectedBody.documentoIdentidad}</p>
              <p><strong>Protocolo Necropsia:</strong> {selectedBody.numeroProtocoloNecropsia}</p>
              <p><strong>Causa de Muerte:</strong> {selectedBody.causaMuerte}</p>
              <p><strong>Fecha de Nacimiento:</strong> {selectedBody.fechaNacimiento}</p>
              <p><strong>Fecha de Defunción:</strong> {selectedBody.fechaDefuncion.toString()}</p>
              <p><strong>Fecha de Ingreso:</strong> {selectedBody.fechaIngreso}</p>
              <p><strong>Fecha de Inhumación:</strong> {selectedBody.fechaInhumacion}</p>
              <p><strong>Fecha de Exhumación:</strong> {selectedBody.fechaExhumacion}</p>
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
      {showRegisterModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Registrar Nuevo Cuerpo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(newBodyData).map(([key, value]) => (
                key !== "estado" ? (
                  <div key={key} className="flex flex-col">
                    <label className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type={key.includes("fechaIngreso") ? "datetime-local" :
                            key.includes("fecha") ? "date" : "text"}
                      value={
                        key.includes("fechaIngreso")
                          ? (value ? (value as string).slice(0, 16) : "")
                          : key.includes("fecha")
                            ? (value ? new Date(value).toISOString().split('T')[0] : "")
                            : (value as string)
                      }
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setNewBodyData((prev) => ({
                          ...prev,
                          [key]: newValue
                        }));
                      }}
                      className="border p-2 rounded"
                    />
                  </div>
                ) : null
              ))}
              <div className="flex flex-col">
                <label className="text-gray-700">Estado</label>
                <select
                  value={newBodyData.estado}
                  onChange={(e) => setNewBodyData((prev) => ({
                    ...prev,
                    estado: e.target.value
                  }))}
                  className="border p-2 rounded"
                >
                  <option value="">Seleccione estado</option>
                  <option value="INHUMADO">Inhumado</option>
                  <option value="EXHUMADO">Exhumado</option>
                </select>
              </div>
            </div>
      
            <div className="flex justify-end gap-4 mt-6">
              <Button
                className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-500"
                onClick={async () => {
                  try {
                    const bodyToSend = {
                      ...newBodyData,
                      fechaIngreso: newBodyData.fechaIngreso
                        ? newBodyData.fechaIngreso + ":00"
                        : "",
                    };
                    await createBody(bodyToSend);
                    Swal.fire('Éxito', 'El cuerpo fue registrado exitosamente.', 'success');
                    setShowRegisterModal(false);
                    window.location.reload(); 
                  } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                    Swal.fire('Error', `Ocurrió un error al registrar el cuerpo: ${errorMessage}`, 'error');
                  }
                }}
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BodiesRegister;