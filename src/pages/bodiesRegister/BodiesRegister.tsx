import { useEffect, useState } from "react";
import { FaFileExport, FaSearch, FaFilter } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"; 
import Button  from "../../components/utilsComponents/Button"; 
import { Input } from "../../components/utilsComponents/Input"; 
import { getAllBodies } from "../../services/managementService"; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { CuerpoInhumado, MappedBody } from "../../models/CuerpoInhumado"; 



const BodiesRegister = () => {

  const [bodiesData, setBodiesData] = useState<MappedBody[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  
    useEffect(() => {
    const fetchData = async () => {
      const data: CuerpoInhumado[] = await getAllBodies();
      const mappedData: MappedBody[] = data.map((item) => ({
        id: item.idCadaver,
        name: `${item.nombre} ${item.apellido}`,
        date: item.fechaIngreso,
        state: item.estado,
        document: `${item.documentoIdentidad || "N/A"}`,
        description: item.observaciones || "Sin observaciones",
       
      }));
      setBodiesData(mappedData);
    };

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

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold">Body Admissions</h2>
      <p className="text-gray-500">Records of recent body admissions to the sanctuary</p>

      {/* Search and Filters */}
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
        <div className="flex items-center space-x-2">
          <Button className="flex items-center bg-blue-700 text-white px-4 py-2">
            <span>Registrar Cuerpo</span>
          </Button>

          <Button className="flex items-center space-x-2 bg-blue-900 text-white px-4 py-2">
            <FaFileExport />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Table */}
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
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.date}</TableCell> 
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.state === "Inhumado" ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
                    }`}
                  >
                    {item.state}
                  </span>
                </TableCell>
                <TableCell>{item.document}</TableCell>
                <TableCell>{item.description}</TableCell> 
                <TableCell>
                  <Button className="bg-slate-700 text-blue-500 hover:underline">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Opcional) */}
      <div className="flex justify-between items-center text-gray-500 mt-4">
        <span>Showing {filteredData.length} </span>
        <div className="flex space-x-2">
          <Button className="text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Previous</Button>
          <Button className="text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default BodiesRegister;
