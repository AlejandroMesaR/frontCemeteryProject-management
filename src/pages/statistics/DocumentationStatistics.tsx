import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Line, Cell } from "recharts";
import {
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getAllDocuments } from "../../services/documentService";
import { getAllUsers } from "../../services/authService";
import { Documento } from "../../models/Documento";

// Tipado para usuarios
interface User {
  id: number;
  username: string;
}

export default function DocumentationStatistics() {
  const [documentTypesData, setDocumentTypesData] = useState<{ name: string; value: number }[]>([]);
  const [weeklyTrendData, setWeeklyTrendData] = useState<{ week: string; count: number; date: Date }[]>([]);
  const [topUsersData, setTopUsersData] = useState<{ username: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener documentos
        const documents: Documento[] = await getAllDocuments();
        console.log("Documentos obtenidos:", documents);
        if (documents.length === 0) {
          console.log("No se encontraron documentos.");
        }

        // Obtener usuarios
        const users: User[] = await getAllUsers();
        console.log("Usuarios obtenidos:", users);
        const userMap = new Map<string, number>();
        users.forEach((user) => userMap.set(user.username, user.id));

        // 1. Distribución de documentos por tipo
        const typeCounts: { [key: string]: number } = {
          REPORTE: 0,
          DIGITALIZACION: 0,
        };
        documents.forEach((doc) => {
          if (doc.tipo in typeCounts) {
            typeCounts[doc.tipo]++;
          }
        });
        const documentTypes = Object.entries(typeCounts).map(([name, value]) => ({
          name,
          value,
        }));
        setDocumentTypesData(documentTypes);

        // 2. Tendencia de generación de documentos por semana (últimos 3 meses)
        const now = new Date();
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        const weeklyCounts: { [key: string]: number } = {};

        // Generar las últimas 12 semanas (de más antiguo a más reciente)
        const weeks: { week: string; date: Date }[] = [];
        for (let i = 11; i >= 0; i--) {
          const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);
          const weekKey = `${weekStart.getDate()}-${weekStart.toLocaleString("default", { month: "short" })}`;
          weeklyCounts[weekKey] = 0;
          weeks.push({ week: weekKey, date: weekStart });
        }

        // Contar documentos por semana
        documents.forEach((doc) => {
          const docDate = new Date(doc.fechaGeneracion);
          if (docDate >= threeMonthsAgo) {
            // Encontrar la semana correspondiente
            for (let i = 0; i < weeks.length; i++) {
              const weekStart = weeks[i].date;
              const nextWeekStart = i < weeks.length - 1 ? weeks[i + 1].date : now;
              if (docDate >= weekStart && docDate < nextWeekStart) {
                const weekKey = weeks[i].week;
                weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
                break;
              }
            }
          }
        });

        // Crear los datos para la gráfica, asegurando el orden correcto
        const weeklyTrend = weeks.map(({ week, date }) => ({
          week,
          date,
          count: weeklyCounts[week] || 0,
        }));
        setWeeklyTrendData(weeklyTrend);

        // 3. Top 3 usuarios con más documentos
        const userCounts: { [key: string]: number } = {};
        documents.forEach((doc) => {
          const userId = doc.usuarioId; // Usar usuarioId como string
          console.log(`Documento: ${doc.id}, usuarioId: ${userId}`);
          if (userId && userId.trim() !== "") {
            userCounts[userId] = (userCounts[userId] || 0) + 1;
          }
        });
        console.log("Conteo de documentos por usuario:", userCounts);

        const topUsers = Object.entries(userCounts)
          .map(([username, count]) => ({
            username,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setTopUsersData(topUsers);
        console.log("Top 3 usuarios:", topUsers);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error al cargar estadísticas:", error);
        Swal.fire("Error", `No se pudieron cargar las estadísticas: ${errorMessage}`, "error");
      }
    };

    fetchData();
  }, []);

  // Función para asignar colores a las barras
  const getBarColor = (name: string) => {
    return name === "REPORTE" ? "#4CAF50" : "#2196F3"; // Verde para REPORTE, Azul para DIGITALIZACION
  };

  // Función para obtener la etiqueta de posición (1°, 2°, 3°)
  const getPositionLabel = (index: number) => {
    switch (index) {
      case 0:
        return "1°";
      case 1:
        return "2°";
      case 2:
        return "3°";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Estadísticas de Documentación</h2>
        <p className="text-sm text-muted-foreground">
          Análisis de la generación y procesamiento de documentos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gráfica de barras: Distribución de documentos por tipo */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Tipos de Documentos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={documentTypesData}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value: number) => `${value} documentos`} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} fillOpacity={0.8}>
                  {documentTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfica de líneas: Tendencia de generación de documentos por semana */}
        <Card className="col-span-2">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Tendencia de Generación de Documentos (Últimas 12 Semanas)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `${value} documentos`} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB" // Blue-600
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas: Top 3 usuarios con más documentos */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Top 3 de Usuarios con Más Reportes Generados</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {topUsersData.length > 0 ? (
              topUsersData.map((user, index) => (
                <div key={index}>
                  <h3 className="text-2xl font-semibold text-blue-600">{user.count}</h3>
                  <p className="text-sm">
                    <span className="text-black">{getPositionLabel(index)}</span>
                    <span className="text-black"> {user.username}</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">
                No hay datos de usuarios disponibles para mostrar
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}