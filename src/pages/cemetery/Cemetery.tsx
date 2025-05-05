import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllNichos } from "../../services/managementService";
import { Nicho } from "../../models";
import { getNicheStyle, getNicheNumber, sortNichosByNumber } from "./functionsCementery";
import NichoDialog from "../../components/dialog/NichoDialog";
import AssignNichoDialog from "../../components/dialog/AssignNichoDialog";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CemeteryMap = () => {
  const [nichos, setNichos] = useState<Nicho[]>([]);
  const [filteredNichos, setFilteredNichos] = useState<Nicho[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterState, setFilterState] = useState<string>("TODOS");

  // Estadísticas
  const totalNichos = nichos.length;
  const ocupados = nichos.filter(nicho => nicho.estado === "OCUPADO").length;
  const disponibles = nichos.filter(nicho => nicho.estado === "DISPONIBLE").length;
  const enMantenimiento = nichos.filter(nicho => nicho.estado === "MANTENIMIENTO").length;

  // Porcentajes para las estadísticas
  const porcentajeOcupados = totalNichos > 0 ? Math.round((ocupados / totalNichos) * 100) : 0;
  const porcentajeDisponibles = totalNichos > 0 ? Math.round((disponibles / totalNichos) * 100) : 0;
  const porcentajeMantenimiento = totalNichos > 0 ? Math.round((enMantenimiento / totalNichos) * 100) : 0;

  const fetchNichos = async () => {
    try {
      setLoading(true);
      const data = await getAllNichos();
      setNichos(data);
      setFilteredNichos(data);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al cargar documentos:', error);
      Swal.fire('Error', `No se pudo cargar la información de los nichos: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar nichos por término de búsqueda y estado
  useEffect(() => {
    let filtered = [...nichos];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(nicho => 
        nicho.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nicho.codigo && nicho.codigo.toString().toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Aplicar filtro de estado
    if (filterState !== "TODOS") {
      filtered = filtered.filter(nicho => nicho.estado === filterState);
    }
    
    setFilteredNichos(filtered);
  }, [searchTerm, filterState, nichos]);

  const popupSuccess = async (message: string) => {
    Swal.fire({
      title: 'Confirmación',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      customClass: {
        confirmButton: 'bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded'
      }
    });

    fetchNichos();
  };

  useEffect(() => {
    fetchNichos();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with breadcrumb */}
      <div className="space-y-2 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de nichos</h1>
            <p className="text-gray-600 mt-1">Representación visual de los nichos del santuario y su estado actual</p>
          </div>
        </div>
      </div>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total de nichos</h3>
          <p className="text-2xl font-bold mt-1">{totalNichos}</p>
          <div className="mt-2">
            <Progress value={100} className="h-2" />
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Ocupados</h3>
          <p className="text-2xl font-bold mt-1 text-red-600">{ocupados} <span className="text-sm text-gray-500 font-normal">({porcentajeOcupados}%)</span></p>
          <div className="mt-2 progress-red">
            <Progress value={porcentajeOcupados} className="h-2 bg-gray-200" />
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Disponibles</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">{disponibles} <span className="text-sm text-gray-500 font-normal">({porcentajeDisponibles}%)</span></p>
          <div className="mt-2 progress-green">
            <Progress value={porcentajeDisponibles} className="h-2 bg-gray-200" />
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">En mantenimiento</h3>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{enMantenimiento} <span className="text-sm text-gray-500 font-normal">({porcentajeMantenimiento}%)</span></p>
          <div className="mt-2 progress-yellow">
            <Progress value={porcentajeMantenimiento} className="h-2 bg-gray-200" />
          </div>
        </Card>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Buscar por ubicación o código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="text-gray-400 h-4 w-4" />
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los estados</SelectItem>
              <SelectItem value="OCUPADO">Ocupados</SelectItem>
              <SelectItem value="DISPONIBLE">Disponibles</SelectItem>
              <SelectItem value="MANTENIMIENTO">En mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content with grid and legend side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cemetery Grid */}
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Mapa de Nichos</h2>
          
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="py-1"><svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg></div>
                <div>
                  <p className="font-bold">Error al cargar datos</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {filteredNichos.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white">
                  <p className="text-gray-500">No se encontraron nichos con los criterios de búsqueda</p>
                </div>
              ) : (
                <Card className="p-4">
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {sortNichosByNumber(filteredNichos).map((nicho) => (
                      <NichoDialog
                        key={nicho.codigo}
                        codigo={nicho.codigo}
                        onAssigned={popupSuccess}
                        trigger={
                          <button
                            className={`h-12 w-full flex items-center justify-center rounded-lg text-sm font-semibold border transition-all ${getNicheStyle(nicho.estado)}`}
                            title={nicho.ubicacion}
                          >
                            {getNicheNumber(nicho.ubicacion)}
                          </button>
                        }
                      />
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Legend Sidebar */}
        <Card className="lg:w-72 p-6 space-y-6 bg-white shadow-lg rounded-xl h-fit sticky top-4">
          <h3 className="font-bold text-lg text-gray-800">Leyenda y estadísticas</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-red-100 border border-red-400" />
              <div>
                <p className="font-medium">Ocupado</p>
                <p className="text-xs text-gray-500">Nicho asignado</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md border border-dashed border-gray-400 bg-gray-50" />
              <div>
                <p className="font-medium">Disponible</p>
                <p className="text-xs text-gray-500">Nicho libre</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md bg-yellow-100 border border-yellow-400" />
              <div>
                <p className="font-medium">En Mantenimiento</p>
                <p className="text-xs text-gray-500">Temporalmente no disponible</p>
              </div>
            </div>
          </div>
          
          <AssignNichoDialog
            trigger={<Button className="w-full bg-sky-950 hover:bg-sky-700 text-white">Asignar Nicho</Button>}
            onAssigned={popupSuccess}
          />
        </Card>
      </div>
    </div>
  );
};

export default CemeteryMap;