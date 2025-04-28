import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Line } from "recharts";
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
  const [monthlyTrendData, setMonthlyTrendData] = useState<{ month: string; count: number }[]>([]);
  const [topUsersData, setTopUsersData] = useState<{ username: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener documentos
        const documents: Documento[] = await getAllDocuments();

        // Obtener usuarios
        const users: User[] = await getAllUsers();
        const userMap = new Map<number, string>();
        users.forEach((user) => userMap.set(user.id, user.username));

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

        // 2. Tendencia de generación de documentos por mes (últimos 12 meses)
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        const monthlyCounts: { [key: string]: number } = {};

        // Inicializar los últimos 12 meses
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = date.toLocaleString("default", { month: "short", year: "2-digit" });
          monthlyCounts[monthKey] = 0;
        }

        // Contar documentos por mes
        documents.forEach((doc) => {
          const docDate = new Date(doc.fechaGeneracion);
          if (docDate >= twelveMonthsAgo) {
            const monthKey = docDate.toLocaleString("default", { month: "short", year: "2-digit" });
            monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
          }
        });

        const monthlyTrend = Object.entries(monthlyCounts)
          .map(([month, count]) => ({
            month,
            count,
          }))
          .sort((a, b) => {
            const dateA = new Date(`01 ${a.month}`);
            const dateB = new Date(`01 ${b.month}`);
            return dateA.getTime() - dateB.getTime();
          });
        setMonthlyTrendData(monthlyTrend);

        // 3. Top 3 usuarios con más documentos
        const userCounts: { [key: number]: number } = {};
        documents.forEach((doc) => {
          const userId = Number(doc.usuarioId); // Convertir usuarioId a número
          if (!isNaN(userId)) {
            userCounts[userId] = (userCounts[userId] || 0) + 1;
          }
        });

        const topUsers = Object.entries(userCounts)
          .map(([userId, count]) => ({
            username: userMap.get(Number(userId)) || `Usuario ${userId}`,
            count,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setTopUsersData(topUsers);
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
                <Bar dataKey="value" fill="#000" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfica de líneas: Tendencia de generación de documentos por mes */}
        <Card className="col-span-2">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Tendencia de Generación de Documentos (Últimos 12 Meses)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value} documentos`} />
                <Line type="monotone" dataKey="count" stroke="#000" dot={true} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas: Top 3 usuarios con más documentos */}
      <Card>
        <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
          {topUsersData.map((user, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold">{user.count}</h3>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}