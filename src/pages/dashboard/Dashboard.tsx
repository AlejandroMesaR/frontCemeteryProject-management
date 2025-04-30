import Header from '../../components/header/Header';
import { Card,CardContent,CardHeader,CardTitle, CardFooter} from '@/components/ui/card';
import { Users, Boxes, CircleOff, LayoutDashboard} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getAllBodies, getAllNichos, getAvailableNichos, getLastBodiesIngress} from '../../services/managementService';
import { formatDate } from '../cemetery/functionsCementery';
import { getAllUsers } from '../../services/authService';
import { Link } from 'react-router-dom';
import { CuerpoInhumado } from '@/models';
import { getOccupancyColorClass } from './DashboardUtils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

function Dashboard() {
  const [totalCuerpos, setTotalCuerpos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalNichos, setTotalNichos] = useState(0);
  const [nichosDisponibles, setNichosDisponibles] = useState(0);
  const [porcentajeOcupacion, setPorcentajeOcupacion] = useState(0);
  const [ultimosIngresos, setUltimosIngresos] = useState<CuerpoInhumado[]>([]);

  const fetchData = async () => {
    try {
      // Obtener cantidad de cuerpos
      const cuerpos = await getAllBodies();
      setTotalCuerpos(cuerpos.length);

      fetchUltimosIngresos();

      // Obtener cantidad de usuarios registrados
      const usuarios = await getAllUsers();
      setTotalUsuarios(usuarios.length);

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
                  className={`
                    h-2
                    ${porcentajeOcupacion >= 90 ? 'bg-red-500' : 
                      porcentajeOcupacion >= 70 ? 'bg-amber-500' : 
                      'bg-green-500'}
                  `}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-500" />
                Usuarios del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsuarios}</div>
              <p className="text-xs text-gray-500">Administradores y operadores</p>
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
                            <Badge variant="outline" className= "bg-purple-100 text-purple-800 ">
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

          {/* Resumen del Mapa */}
          <Card className="col-span-7 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Resumen del Mapa del Cementerio</h3>
            <p className="text-sm text-gray-600">
              Aquí se mostrará el estado actual de ocupación por sección
            </p>
            <div className="mt-4 flex items-center justify-center h-full bg-gray-100 text-gray-400 flex-grow">
              Visualización del mapa del cementerio
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
