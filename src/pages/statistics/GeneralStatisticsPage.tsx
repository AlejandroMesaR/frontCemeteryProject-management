import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getAllBodies, getAllNichos, getAvailableNichos } from "../../services/managementService";
import { getAllUsers } from "../../services/authService";

export default function GeneralStatisticsPage() {
  const [totalCuerpos, setTotalCuerpos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [nichosDisponibles, setNichosDisponibles] = useState(0);
  const [porcentajeOcupacion, setPorcentajeOcupacion] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener cantidad de cuerpos
        const cuerpos = await getAllBodies();
        setTotalCuerpos(cuerpos.length);

        // Obtener cantidad de usuarios registrados
        const usuarios = await getAllUsers();
        setTotalUsuarios(usuarios.length);

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

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cantidad de Cuerpos</p>
            <h3 className="text-2xl font-bold">{totalCuerpos}</h3>
            <p className="text-xs text-gray-500 mt-1">Total registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Nichos Disponibles</p>
            <h3 className="text-2xl font-bold">{nichosDisponibles}</h3>
            <p className="text-xs text-gray-500 mt-1">Espacios libres</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Porcentaje de Ocupación</p>
            <h3 className="text-2xl font-bold">{porcentajeOcupacion}%</h3>
            <p className="text-xs text-gray-500 mt-1">Ocupación actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Usuarios Registrados</p>
            <h3 className="text-2xl font-bold">{totalUsuarios}</h3>
            <p className="text-xs text-gray-500 mt-1">Total en el sistema</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}