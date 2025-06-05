import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/utilsComponents/Input";
import { FaSearch, FaList, FaTrash, FaArrowLeft } from "react-icons/fa";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { isAuthenticated } from "../../utils/auth";
import { getEventsByBodyId, deleteEvent, getBodyById  } from "../../services/managementService";
import EditEventDialog from "../../components/dialog/EditEventDialogProps";
import CreateEventDialog from "../../components/dialog/CreateEventDialogProps";
import EventDetailsDialog from "@/components/dialog/EventDetailsDialog";
import CloudinaryFileHandler from "../../components/dialog/CloudinaryFileHandler";
import { EventoCuerpo, CuerpoInhumado } from "../../models";

const BodyEvents = () => {
  const { idCadaver } = useParams<{ idCadaver: string }>();
  const [events, setEvents] = useState<EventoCuerpo[]>([]);
  const [body, setBody] = useState<CuerpoInhumado | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchData = async () => {
    if (!isAuthenticated()) {
      Swal.fire('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error');
      return;
    }

    if (!idCadaver) {
      Swal.fire('Error', 'ID del cuerpo no proporcionado.', 'error');
      setLoading(false);
      return;
    }

    try {
      const [eventsData, bodyData] = await Promise.all([
        getEventsByBodyId(idCadaver),
        getBodyById(idCadaver),
      ]);
      setEvents(eventsData);
      setBody(bodyData);
      setLoading(false);
    } catch (error: any) {
      const errorMessage = error.message || 'Error desconocido al cargar los datos';
      Swal.fire('Error', errorMessage, 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idCadaver]);

   
  function normalizeText(text: string): string {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  const filteredEvents = events.filter((event) =>
    normalizeText(event.resumenEvento).includes(normalizeText(search)) ||
    normalizeText(event.tipoEvento).includes(normalizeText(search))
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredEvents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handleUpdate = async (message: string, type: string) => {
    await Swal.fire({
      title: type === 'success' ? 'Actualización Exitosa' : 'Error en la Actualización',
      text: message,
      icon: type === 'success' ? 'success' : 'error',
      confirmButtonText: 'Ok'
    });
  };

  const handleDelete = async (id: string, tipoEvento: string, fechaEvento:string) => {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Esta acción eliminará el evento ${tipoEvento} de la fecha ${fechaEvento} de manera permanente.`,
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
          await deleteEvent(id);
          Swal.fire('Eliminado', `El evento ha sido eliminado exitosamente.`, 'success');
          fetchData(); // Refresh the list after deletion
        } catch (error) {
          Swal.fire('Error', 'Ocurrió un error al eliminar.', 'error');
        }
      }
  };

  const handleCreate = async (message: string, type: string) => {
    await Swal.fire({
      title: type === 'success' ? 'Creación Exitosa' : 'Error en la Creación',
      text: message,
      icon: type === 'success' ? 'success' : 'error',
      confirmButtonText: 'Ok'
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-extrabold">Eventos del Cuerpo</h2>
        <Link to="/bodies" className="flex items-center">
          <Button size="lg" className="bg-gray-700 text-white px-3 py-2 rounded-3xl hover:bg-gray-800">
            <FaArrowLeft />
            <span className="ml-1 font-semibold">Volver</span>
          </Button>
        </Link>
      </div>
      {body && (
        <div className="mt-4 space-y-2 text-gray-700 pl-1">
          <div className="text-3xl font-extrabold">{body.nombre} {body.apellido}</div>
          <div className="pl-3 space-y-1">
            <div><span className="font-semibold">Documento de Identidad:</span> {body.documentoIdentidad}</div>
            <div>
              <span className="font-semibold">Estado:</span>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  body.estado === "INHUMADO" ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
                }`}
              >
                {body.estado}
              </span>
            </div>
            <div><span className="font-semibold">Fecha de Ingreso:</span> {body.fechaIngreso}</div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar eventos..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CreateEventDialog
          idCadaver={idCadaver || ""}
          trigger={
            <Button className="bg-gray-700 text-white px-4 py-2 hover:bg-gray-800">
              Registrar Evento
            </Button>
          }
          onCreate={(message, type) => {
              handleCreate(message, type);
              fetchData();
            }}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <Table className="w-full border rounded-lg">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Fecha del Evento</TableHead>
              <TableHead>Tipo de Evento</TableHead>
              <TableHead>Resumen</TableHead>
              <TableHead>Archivo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
              </TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No se encontraron eventos</TableCell>
              </TableRow>
            ) : (
              currentItems.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.fechaEvento}</TableCell>
                  <TableCell>{event.tipoEvento}</TableCell>
                  <TableCell>{event.resumenEvento}</TableCell>
                  <TableCell>
                    {event.archivo ? (
                      <CloudinaryFileHandler fileUrl={event.archivo} />
                    ) : (
                      "Sin archivo"
                    )}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <EventDetailsDialog
                      event={event}
                      trigger={
                        <Button className="bg-blue-600 hover:bg-blue-400 transition">
                          <FaList />
                        </Button>
                      }
                    />
                    <EditEventDialog
                      event={event}
                      onUpdate={(message, type) => {
                        handleUpdate(message, type);
                        fetchData();
                      }}
                    />
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleDelete(event.id, event.tipoEvento, event.fechaEvento)}
                    >
                      <FaTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-gray-500 mt-4">
        <span>
          Mostrando {startIndex + 1} -{" "}
          {endIndex > filteredEvents.length ? filteredEvents.length : endIndex} de{" "}
          {filteredEvents.length}
        </span>
        <div className="flex space-x-2">
          <Button
            className="text-white bg-blue-700 px-3 py-1 rounded-lg hover:bg-blue-500"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            className="text-white bg-blue-700 px-3 py-1 rounded-lg hover:bg-blue-500"
            onClick={() =>
              setCurrentPage((prev) =>
                prev < totalPages ? prev + 1 : prev
              )
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BodyEvents;