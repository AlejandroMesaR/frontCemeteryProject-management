import Header from '../../components/header/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Boxes, CircleOff, LayoutDashboard, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getAllBodies, getAllNichos, getAvailableNichos, getLastBodiesIngress, searchBodies, getNichoByIdCuerpo } from '../../services/managementService';
import { formatDate } from '../cemetery/functionsCementery';
import { Link } from 'react-router-dom';
import { CuerpoInhumado } from '@/models';
import { Nicho } from '@/models/Nicho';
import { getOccupancyColorClass } from './DashboardUtils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/components/utilsComponents/useDebounce';
import { capitalize } from 'lodash';

function Dashboard() {
  const [totalCuerpos, setTotalCuerpos] = useState(0);
  const [totalNichos, setTotalNichos] = useState(0);
  const [nichosDisponibles, setNichosDisponibles] = useState(0);
  const [porcentajeOcupacion, setPorcentajeOcupacion] = useState(0);
  const [ultimosIngresos, setUltimosIngresos] = useState<CuerpoInhumado[]>([]);
  const [search, setSearch] = useState("");
  const [filteredBodies, setFilteredBodies] = useState<CuerpoInhumado[]>([]);
  const [selectedBody, setSelectedBody] = useState<CuerpoInhumado | null>(null);
  const [selectedNicho, setSelectedNicho] = useState<Nicho | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  
  // Use debounce to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);

  const fetchData = async () => {
    try {
      // Obtener cantidad de cuerpos
      const cuerpos = await getAllBodies();
      setTotalCuerpos(cuerpos.length);

      fetchUltimosIngresos();

      const nichos = await getAllNichos();
      setTotalNichos(nichos.length);   

      // Obtener nichos totales y disponibles
      const nichosTotales = await getAllNichos();
      const nichosDisponiblesData = await getAvailableNichos();
      const totalNichos = nichosTotales.length;
      const disponibles = nichosDisponiblesData.length;
      setNichosDisponibles(disponibles);

      // Calcular porcentaje de ocupación
      if (totalNichos > 0) {
        const ocupados = totalNichos - disponibles;
        const porcentaje = Math.round((ocupados / totalNichos) * 100);
        setPorcentajeOcupacion(porcentaje);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error("Error al cargar estadísticas:", error);
      Swal.fire("Error", `No se pudieron cargar las estadísticas: ${errorMessage}`, "error");
    }
  };

  const fetchUltimosIngresos = async () => {
    try {
      const cuerpos = await getLastBodiesIngress(5);
      setUltimosIngresos(cuerpos);
    } catch (error) {
      console.error("Error al cargar el último ingreso:", error);
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setFilteredBodies([]);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchBodies(query);
      setFilteredBodies(results);
      setNoResults(results.length === 0);
    } catch (error) {
      console.error("Error al buscar cuerpos:", error);
      setFilteredBodies([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchNichoInfo = async (idCadaver: string) => {
    try {
      const nicho = await getNichoByIdCuerpo(idCadaver);

      if (nicho === null) {
        console.log("No se encontró información del nicho para el cuerpo seleccionado.");
        setSelectedNicho(null);
      }else {
        console.log("Información del nicho:", nicho);
        setSelectedNicho(nicho);
      }

    } catch (error) {
      console.error("Error al obtener información del nicho:", error);
      setSelectedNicho(null);
    }
  };

  const handleBodySelect = (body: CuerpoInhumado) => {
    setSelectedBody(body);
    fetchNichoInfo(body.idCadaver);
  };

  // Effect for the debounced search
  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full space-y-4">
      <Header />
      <div className='bg-gray-100 px-4'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-1">
          <Card className="overflow-hidden border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Boxes className="mr-2 h-4 w-4 text-blue-500" />
                Cuerpos Registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-start items-center">
                <div>
                  <div className="text-2xl font-bold">{totalCuerpos}</div>
                  <p className="text-xs text-gray-500">Total en el sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <CircleOff className="mr-2 h-4 w-4 text-green-500" />
                Nichos Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{nichosDisponibles}</div>
                  <p className="text-xs text-gray-500">De {totalNichos} totales</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-xs mr-1">Disponibilidad</span>
                  <span className={`font-medium ${getOccupancyColorClass(100 - porcentajeOcupacion)}`}>
                    {100 - porcentajeOcupacion}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4 text-amber-500" />
                Ocupación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">{porcentajeOcupacion}%</div>
                  <div className={getOccupancyColorClass(porcentajeOcupacion)}>
                    {porcentajeOcupacion >= 90 ? 'Crítico' : 
                      porcentajeOcupacion >= 70 ? 'Moderado' : 'Óptimo'}
                  </div>
                </div>
                <Progress 
                  value={porcentajeOcupacion} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-2 flex-1">
          {/* Entradas Recientes */}
          <Card className="lg:col-span-5 overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <div className="justify-between items-center">
                <CardTitle className="text-lg font-semibold">Ingresos Recientes</CardTitle>
                <p className="text-sm text-gray-500">Últimos 5 cuerpos ingresados al sistema</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {ultimosIngresos.length > 0 ? (
                <div className="divide-y">
                  {ultimosIngresos.map((cuerpo, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{cuerpo.nombre} {cuerpo.apellido}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="mr-2">ID: {cuerpo.documentoIdentidad}</span>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              {cuerpo.causaMuerte}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatDate(cuerpo.fechaInhumacion)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Fecha Ingreso
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Boxes className="h-12 w-12 mb-4 text-gray-300" />
                  <p>No hay registros recientes</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t p-3">
              <Link
                to="/bodies"
                className="block w-full bg-slate-800 hover:bg-slate-500 text-white hover:text-gray-800 text-center text-lg py-1 rounded-lg mt-5 transition-colors"
              >
                Ver Todos los Registros
              </Link>
            </CardFooter>
          </Card>

          {/* Buscador de Cuerpos Inhumados */}
          <Card className="col-span-7 flex flex-col">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Buscador de Cuerpos Inhumados
              </CardTitle>
              <p className="text-sm text-gray-600">
                Ingresa el nombre, apellido, nombre y apellido, cédula o código para consultar información sobre un cuerpo inhumado.
              </p>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4">
              {/* Barra de búsqueda */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Buscar por nombre, cédula o código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
              </div>

              {/* Estado de búsqueda */}
              {isSearching && (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}

              {/* Mensaje de no resultados */}
              {noResults && !isSearching && search.trim() !== "" && (
                <div className="text-center py-4 text-gray-500">
                  No se encontraron resultados para "{search}"
                </div>
              )}

              {/* Resultados de búsqueda */}
              {!isSearching && filteredBodies.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredBodies.map((body) => (
                    <Card
                      key={body.idCadaver}
                      onClick={() => handleBodySelect(body)}
                      className={`p-3 hover:bg-gray-50 cursor-pointer transition ${
                        selectedBody?.idCadaver === body.idCadaver ? "border-blue-500 bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{body.nombre} {body.apellido}</p>
                          <p className="text-sm text-gray-500">{capitalize(body.estado)}</p>
                        </div>
                        <Badge variant="outline" className="bg-gray-100">
                          ID: {body.idCadaver}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Detalles del cuerpo seleccionado */}
              {selectedBody && (
                <Card className="p-4 border border-gray-200 bg-gray-50 mt-4">
                  <h4 className="font-semibold text-lg mb-3 text-gray-800">Información del Cuerpo</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="font-medium">{selectedBody.nombre} {selectedBody.apellido}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Ingreso</p>
                      <p className="font-medium">{formatDate(selectedBody.fechaIngreso)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Causa de Muerte</p>
                      <Badge className="mt-1 bg-purple-100 text-purple-800 hover:bg-purple-300 border-none">
                        {capitalize(selectedBody.causaMuerte)}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Fecha de Defunción</p>
                      <p className="font-medium">{formatDate(selectedBody.fechaDefuncion)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-300 border-none">
                        {capitalize(selectedBody.estado)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h5 className="font-semibold mb-2">Información del Nicho</h5>
                    
                    {selectedNicho != null ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-sm text-gray-500">Código</p>
                          <p className="font-medium">{selectedNicho.codigo}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Ubicación</p>
                          <p className="font-medium">{selectedNicho.ubicacion}</p>
                        </div>
                        
                      </div>
                    ) : (selectedNicho === null) ? (
                      <div className="text-gray-500 italic">
                        Este cuerpo no está asignado a un nicho.
                      </div>
                    ):(
                      <div className="text-gray-500 italic">
                        Cargando información del nicho...
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;