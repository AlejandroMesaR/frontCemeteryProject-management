import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis } from "recharts";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getAllBodies, getAllNichos, getAllNichosCuerpos } from "../../services/managementService";
import { getAllUsers } from "../../services/authService";

// Interfaces (extraídas de la información proporcionada)
interface Nicho {
  codigo: string;
  ubicacion: string;
  estado: "DISPONIBLE" | "OCUPADO" | "MANTENIMIENTO";
}

interface CuerpoInhumado {
  idCadaver: string;
  nombre: string;
  apellido: string;
  documentoIdentidad: string;
  numeroProtocoloNecropsia: string;
  causaMuerte: string;
  fechaNacimiento: string;
  fechaDefuncion: Date;
  fechaIngreso: string;
  fechaInhumacion: string;
  fechaExhumacion: string;
  funcionarioReceptor: string;
  cargoFuncionario: string;
  autoridadRemitente: string;
  cargoAutoridadRemitente: string;
  autoridadExhumacion: string;
  cargoAutoridadExhumacion: string;
  estado: string;
  observaciones: string;
}

interface NichoCuerpoCreate {
  codigoNicho: string;
  idCadaver: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  identificationNumber: string;
  role?: string;
}

export default function GeneralStatisticsPage() {
  const [totalCuerpos, setTotalCuerpos] = useState(0);
  const [totalNichos, setTotalNichos] = useState(0);
  const [nichosDisponibles, setNichosDisponibles] = useState(0);
  const [cuerposAsignados, setCuerposAsignados] = useState(0);
  const [porcentajeOcupacion, setPorcentajeOcupacion] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [cuerposRecientes, setCuerposRecientes] = useState(0);
  const [usersByRoleData, setUsersByRoleData] = useState<{ name: string; value: number }[]>([]);
  const [inhumationsByMonthData, setInhumationsByMonthData] = useState<{ month: string; inhumations: number }[]>([]);

  // Colores para el gráfico de usuarios por rol
  const USER_ROLE_COLORS = ["#FF9800", "#F44336", "#2196F3", "#4CAF50"]; // Naranja, Rojo, Azul, Verde

  // Color para el gráfico de tendencia de inhumaciones
  const LINE_COLOR = "#2196F3"; // Azul

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener cantidad de cuerpos
        const cuerpos: CuerpoInhumado[] = await getAllBodies();
        setTotalCuerpos(cuerpos.length);

        // Calcular cuerpos inhumados en el último mes
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const recientes = cuerpos.filter(cuerpo => {
          const fechaInhumacion = new Date(cuerpo.fechaInhumacion);
          return fechaInhumacion >= oneMonthAgo;
        }).length;
        setCuerposRecientes(recientes);

        // Calcular inhumaciones por mes (últimos 12 meses)
        const monthlyCounts: { [key: string]: number } = {};
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' }); // Ejemplo: "Ene 25"
          monthlyCounts[monthKey] = 0;
        }
        cuerpos.forEach(cuerpo => {
          const fechaInhumacion = new Date(cuerpo.fechaInhumacion);
          const monthKey = fechaInhumacion.toLocaleString('default', { month: 'short', year: '2-digit' });
          if (Object.keys(monthlyCounts).includes(monthKey)) {
            monthlyCounts[monthKey]++;
          }
        });
        const inhumationsByMonth = Object.keys(monthlyCounts).map(month => ({
          month,
          inhumations: monthlyCounts[month],
        }));
        setInhumationsByMonthData(inhumationsByMonth);

        // Obtener cantidad de usuarios registrados
        const usuarios: User[] = await getAllUsers();
        setTotalUsuarios(usuarios.length);

        // Calcular usuarios por rol
        const roleCounts: { [key: string]: number } = {};
        usuarios.forEach(user => {
          const role = user.role || "Sin Rol";
          roleCounts[role] = (roleCounts[role] || 0) + 1;
        });
        const usersByRole = Object.keys(roleCounts).map(role => ({
          name: role,
          value: roleCounts[role],
        }));
        setUsersByRoleData(usersByRole);

        // Obtener nichos
        const nichos: Nicho[] = await getAllNichos();
        setTotalNichos(nichos.length);

        // Calcular nichos disponibles
        const disponiblesCount = nichos.filter(nicho => nicho.estado === "DISPONIBLE").length;
        setNichosDisponibles(disponiblesCount);

        // Obtener asignaciones de cuerpos a nichos
        const nichosCuerpos: NichoCuerpoCreate[] = await getAllNichosCuerpos();
        setCuerposAsignados(nichosCuerpos.length);

        // Calcular porcentaje de ocupación
        if (nichos.length > 0) {
          const porcentaje = Math.round((nichosCuerpos.length / nichos.length) * 100);
          setPorcentajeOcupacion(porcentaje);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error al cargar estadísticas:", error);
        Swal.fire("Error", `No se pudieron cargar las estadísticas: ${errorMessage}`, "error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Tarjeta 1: Estadísticas generales (rectangular, abarca todo el ancho) */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Estadísticas Generales</CardTitle>
          <CardDescription>
            Resumen de cuerpos, nichos y usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de Cuerpos</p>
              <p className="text-lg font-semibold">{totalCuerpos.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de Nichos</p>
              <p className="text-lg font-semibold">{totalNichos.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cuerpos Asignados</p>
              <p className="text-lg font-semibold">{cuerposAsignados.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Porcentaje de Ocupación</p>
              <p className="text-lg font-semibold">{porcentajeOcupacion}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nichos Disponibles</p>
              <p className="text-lg font-semibold">{nichosDisponibles.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usuarios Registrados</p>
              <p className="text-lg font-semibold">{totalUsuarios.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cuerpos Inhumados (Último Mes)</p>
              <p className="text-lg font-semibold">{cuerposRecientes.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficas (en paralelo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfica 1: Tendencia de Inhumaciones (Gráfico de líneas) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tendencia de Inhumaciones</CardTitle>
            <CardDescription>
              Inhumaciones por mes (últimos 12 meses)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inhumationsByMonthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value} inhumaciones`} />
                  <Line type="monotone" dataKey="inhumations" stroke={LINE_COLOR} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-black mt-2">
              Inhumaciones mensuales
            </p>
          </CardContent>
        </Card>

        {/* Gráfica 2: Usuarios por Rol (Gráfico de pastel) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución de Usuarios por Rol</CardTitle>
            <CardDescription>
              Usuarios registrados por rol
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRoleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {usersByRoleData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={USER_ROLE_COLORS[index % USER_ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value} usuarios`} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-black mt-2">
              Distribución de usuarios
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}