import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getAllBodies, getAllNichos, getAllNichosCuerpos } from "../../services/managementService";

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

export default function OccupancyAnalysisPage() {
  const [nichoChartData, setNichoChartData] = useState<{ name: string; value: number }[]>([]);
  const [cuerpoChartData, setCuerpoChartData] = useState<{ name: string; value: number }[]>([]);
  const [totalBodies, setTotalBodies] = useState(0);
  const [totalNichos, setTotalNichos] = useState(0);
  const [cuerposAsignados, setCuerposAsignados] = useState(0);
  const [porcentajeOcupacion, setPorcentajeOcupacion] = useState(0);

  // Colores para el gráfico de nichos
  const NICHO_COLORS = ["#4CAF50", "#2196F3", "#FF5722"]; // Verde, Azul, Naranja

  // Colores para el gráfico de cuerpos
  const CUERPO_COLORS = ["#AB47BC", "#42A5F5"]; // Púrpura, Azul claro

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener cantidad de cuerpos
        const cuerpos: CuerpoInhumado[] = await getAllBodies();
        setTotalBodies(cuerpos.length);

        // Obtener nichos
        const nichos: Nicho[] = await getAllNichos();
        setTotalNichos(nichos.length);

        // Calcular nichos ocupados, disponibles y en mantenimiento
        const ocupadosCount = nichos.filter(nicho => nicho.estado === "OCUPADO").length;
        const disponiblesCount = nichos.filter(nicho => nicho.estado === "DISPONIBLE").length;
        const mantenimientoCount = nichos.filter(nicho => nicho.estado === "MANTENIMIENTO").length;

        // Obtener asignaciones de cuerpos a nichos
        const nichosCuerpos: NichoCuerpoCreate[] = await getAllNichosCuerpos();
        setCuerposAsignados(nichosCuerpos.length);

        // Calcular porcentaje de ocupación
        if (nichos.length > 0) {
          const porcentaje = Math.round((nichosCuerpos.length / nichos.length) * 100);
          setPorcentajeOcupacion(porcentaje);
        }

        // Preparar datos para el gráfico de nichos
        setNichoChartData([
          { name: "Ocupados", value: ocupadosCount },
          { name: "Disponibles", value: disponiblesCount },
          { name: "En Mantenimiento", value: mantenimientoCount },
        ]);

        // Preparar datos para el gráfico de cuerpos
        const cuerposNoAsignados = cuerpos.length - nichosCuerpos.length;
        setCuerpoChartData([
          { name: "Asignados", value: nichosCuerpos.length },
          { name: "No Asignados", value: cuerposNoAsignados >= 0 ? cuerposNoAsignados : 0 },
        ]);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error al cargar estadísticas de ocupación:", error);
        Swal.fire("Error", `No se pudieron cargar las estadísticas: ${errorMessage}`, "error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* Tarjeta 1: Estadísticas de ocupación (rectangular, abarca todo el ancho) */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Estadísticas de Ocupación</CardTitle>
          <CardDescription>
            Detalles de cuerpos y nichos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de Cuerpos</p>
              <p className="text-lg font-semibold">{totalBodies.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de Nichos</p>
              <p className="text-lg font-semibold">{totalNichos.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cuerpos Asignados a Nichos</p>
              <p className="text-lg font-semibold">{cuerposAsignados.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Porcentaje de Ocupación</p>
              <p className="text-lg font-semibold">{porcentajeOcupacion}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos de pastel (en paralelo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tarjeta 2: Gráfico de pastel (Nichos) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Análisis de Ocupación de Nichos</CardTitle>
            <CardDescription>
              Distribución actual de los nichos
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nichoChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {nichoChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={NICHO_COLORS[index % NICHO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value} nichos`} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-black mt-2">
              Distribución de nichos
            </p>
          </CardContent>
        </Card>

        {/* Tarjeta 3: Gráfico de pastel (Cuerpos Asignados vs. No Asignados) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución de Cuerpos</CardTitle>
            <CardDescription>
              Cuerpos asignados vs. no asignados
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cuerpoChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {cuerpoChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CUERPO_COLORS[index % CUERPO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value} cuerpos`} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-black mt-2">
              Distribución de cuerpos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}