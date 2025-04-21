import { useEffect, useState } from "react";
import { FaFileExport, FaSearch, FaFilter } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"; 
import Button  from "../../components/utilsComponents/Button"; 
import { Input } from "../../components/utilsComponents/Input"; 
import { getAllBodies } from "../../services/managementService"; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";

const data = [
  { id: "CINR-2023-0567", date: "11/8/2023", type: "Unidentified", origin: "Forensic Lab North", location: "Block A, Level 2, Niche 067" },
  { id: "CNI-2023-0432", date: "27/7/2023", type: "Identified", origin: "Forensic Lab Central", location: "Block B, Level 1, Niche 122" },
  { id: "CINR-2023-0521", date: "4/8/2023", type: "Unidentified", origin: "Forensic Lab East", location: "Block A, Level 3, Niche 045" },
  { id: "CNI-2023-0489", date: "31/7/2023", type: "Identified", origin: "Forensic Lab West", location: "Block C, Level 2, Niche 078" },
  { id: "CINR-2023-0578", date: "14/8/2023", type: "Unidentified", origin: "Forensic Lab Central", location: "Block A, Level 4, Niche 012" },
  { id: "CNI-2023-0501", date: "2/8/2023", type: "Identified", origin: "Forensic Lab North", location: "Block B, Level 3, Niche 034" },
  { id: "CINR-2023-0534", date: "6/8/2023", type: "Unidentified", origin: "Forensic Lab South", location: "Block D, Level 1, Niche 098" },
  { id: "CINR-2023-0556", date: "9/8/2023", type: "Unidentified", origin: "Forensic Lab West", location: "Block C, Level 1, Niche 056" },
];

const BodiesRegister = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const filteredData = data.filter((item) => {
    return (
      (filterType === "All" || item.type === filterType) &&
      item.id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const cuerpos = async () => {
    const data = await getAllBodies();
    console.log(data);
  }

  useEffect( () => {
    cuerpos();
  }, );





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
              <span>{filterType === "All" ? "All Types" : filterType}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterType("All")}>All Types</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Identified")}>Identified</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Unidentified")}>Unidentified</DropdownMenuItem>
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
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.type === "Identified" ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"
                    }`}
                  >
                    {item.type}
                  </span>
                </TableCell>
                <TableCell>{item.origin}</TableCell>
                <TableCell>{item.location}</TableCell>
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
        <span>Showing {filteredData.length} of {data.length} records</span>
        <div className="flex space-x-2">
          <Button className="text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Previous</Button>
          <Button className="text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default BodiesRegister;
