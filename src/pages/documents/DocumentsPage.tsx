import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/utilsComponents/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { File, Download, Search } from "lucide-react";
import { getAllDocuments, deleteDocument, createDocument } from "../../services/documentService";
import { Documento, MappedDocument } from "../../models/Documento";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function DocumentsPage() {
  const [documentsData, setDocumentsData] = useState<MappedDocument[]>([]);
  const [allDocuments, setAllDocuments] = useState<Documento[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Documento | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocument, setNewDocument] = useState<Omit<Documento, 'id'>>({
    nombre: '',
    fechaGeneracion: new Date().toISOString(),
    tipo: 'REPORTE', // Valor por defecto, podríamos hacer un dropdown si hay más tipos
    usuarioId: 'user-demo', // Podríamos obtener el usuario actual desde el token
  });
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Documento[] = await getAllDocuments();
        setAllDocuments(data);
        const mappedData: MappedDocument[] = data.map((item) => ({
          id: item.id,
          title: item.nombre,
          date: item.fechaGeneracion,
          type: item.tipo,
          relatedTo: item.usuarioId,
          status: "Procesado",
        }));
        setDocumentsData(mappedData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error', `No se pudieron cargar los documentos: ${errorMessage}`, 'error');
      }
    };

    fetchData();
  }, []);

  const filteredDocuments = documentsData.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredDocuments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el documento de manera permanente.',
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
        Swal.fire('Eliminado', 'El documento ha sido eliminado exitosamente.', 'success');
        setDocumentsData((prev) => prev.filter((item) => item.id !== id));
        setAllDocuments((prev) => prev.filter((item) => item.id !== id));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        Swal.fire('Error', `Ocurrió un error al eliminar: ${errorMessage}`, 'error');
      }
    }
  };

  const handleViewDetails = (id: string) => {
    const fullDocument = allDocuments.find((doc) => doc.id === id);
    if (fullDocument) {
      setSelectedDocument(fullDocument);
      setShowModal(true);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const createdDocument: Documento = await createDocument(newDocument);
      setAllDocuments((prev) => [...prev, createdDocument]);
      const mappedDocument: MappedDocument = {
        id: createdDocument.id,
        title: createdDocument.nombre,
        date: createdDocument.fechaGeneracion,
        type: createdDocument.tipo,
        relatedTo: createdDocument.usuarioId,
        status: "Procesado",
      };
      setDocumentsData((prev) => [...prev, mappedDocument]);
      setShowCreateModal(false);
      Swal.fire('Creado', 'El documento ha sido creado exitosamente.', 'success');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      Swal.fire('Error', `Ocurrió un error al crear el documento: ${errorMessage}`, 'error'); 
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="">
        <h2 className="text-xl font-semibold">Repositorio de Documentos</h2>
        <p className="text-gray-500 text-sm">Gestiona toda la documentación y registros del cementerio</p>
        <div className="mt-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button variant="outline">Filtrar</Button>
          <Button
            className="bg-blue-700 text-white px-4 py-2 hover:underline hover:bg-blue-500"
            onClick={() => setShowCreateModal(true)}
          >
            Crear Documento
          </Button>
        </div>
      </div>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>ID del Documento</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Relacionado con</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.id}</TableCell>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{doc.relatedTo}</TableCell>
              <TableCell>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-200">{doc.type}</span>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-white">{doc.status}</span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  className="border bg-gray-200 text-black hover:bg-gray-500 hover:text-white"
                  onClick={() => handleViewDetails(doc.id)}
                >
                  <File className="w-4 h-4 mr-1" /> Ver
                </Button>
                <Button className="bg-green-200 text-green-700">
                  <Download className="w-4 h-4 mr-1" /> Descargar
                </Button>
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

      {/* Modal de detalles */}
      {showModal && selectedDocument && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-8 text-center">Detalles del Documento</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>ID:</strong> {selectedDocument.id}</p>
              <p><strong>Nombre:</strong> {selectedDocument.nombre}</p>
              <p><strong>Fecha de Generación:</strong> {selectedDocument.fechaGeneracion}</p>
              <p><strong>Tipo:</strong> {selectedDocument.tipo}</p>
              <p><strong>Usuario ID:</strong> {selectedDocument.usuarioId}</p>
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

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-8 text-center">Crear Nuevo Documento</h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <label className="block mb-1"><strong>Nombre:</strong></label>
                <Input
                  type="text"
                  value={newDocument.nombre}
                  onChange={(e) => setNewDocument({ ...newDocument, nombre: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Tipo:</strong></label>
                <Input
                  type="text"
                  value={newDocument.tipo}
                  onChange={(e) => setNewDocument({ ...newDocument, tipo: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Usuario ID:</strong></label>
                <Input
                  type="text"
                  value={newDocument.usuarioId}
                  onChange={(e) => setNewDocument({ ...newDocument, usuarioId: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreateDocument}
              >
                Crear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}