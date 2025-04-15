import { Button } from "../../components/ui/button";
import { Input } from "../../components/utilsComponents/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { File, Download, Search } from "lucide-react";

const documents = [
  { id: "DOC-2024-0123", title: "Certificado de Defunción", relatedTo: "Robert Johnson (B-2024-083)", type: "Digitalizado", status: "Procesado" },
  { id: "DOC-2024-0122", title: "Permiso de Sepultura", relatedTo: "Maria Garcia (B-2024-082)", type: "Generado por IA", status: "Aprobado" },
  { id: "DOC-2024-0121", title: "Autorización Familiar", relatedTo: "James Smith (B-2024-081)", type: "Original", status: "Pendiente" },
  { id: "DOC-2024-0120", title: "Certificado de Defunción", relatedTo: "Emily Davis (B-2024-080)", type: "Digitalizado", status: "Procesado" },
  { id: "DOC-2024-0119", title: "Certificado de Propiedad de Lote", relatedTo: "Michael Wilson (B-2024-079)", type: "Generado por IA", status: "Aprobado" },
  { id: "DOC-2024-0118", title: "Permiso de Sepultura", relatedTo: "Sofia Martinez (B-2024-078)", type: "Digitalizado", status: "Procesado" },
];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

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
          {filteredDocuments.map((doc) => (
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
                <Button className="border bg-gray-200 text-black hover:bg-gray-500 hover:text-white">
                  <File className="w-4 h-4 mr-1" /> Ver
                </Button>
                <Button className="bg-green-200 text-green-700">
                  <Download className="w-4 h-4 mr-1" /> Descargar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
