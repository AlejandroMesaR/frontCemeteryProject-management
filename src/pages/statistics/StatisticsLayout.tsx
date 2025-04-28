import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { getUserId, isAuthenticated } from "../../utils/auth";

export default function Statistics() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirigir a /statistics/generalStadistics si estamos en /statistics
  useEffect(() => {
    if (location.pathname === "/statistics" || location.pathname === "/statistics/") {
      navigate("generalStadistics", { replace: true });
    }
  }, [location, navigate]);

  // Determinar la pestaña activa según la URL
  const isGeneralActive = location.pathname.includes("generalStadistics");
  const isOccupancyActive = location.pathname.includes("occupancy");
  const isDocumentationActive = location.pathname.includes("documentationStadistics");

  // Función para exportar informe (copiada de handleDownload en DocumentsPage)
  const handleExport = async () => {
    if (!isAuthenticated()) {
      Swal.fire("Error", "No estás autenticado. Por favor, inicia sesión.", "error");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      Swal.fire("Error", "No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8083/reportes/descargar?usuarioId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al exportar el informe");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "informe.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire("Éxito", "El informe ha sido exportado exitosamente.", "success");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      Swal.fire("Error", `Ocurrió un error al exportar el informe: ${errorMessage}`, "error");
    }
  };

  return (
    <div className="p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Estadísticas del Cementerio</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExport}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Exportar Informe
            </Button>
          </div>
        </div>

        <div className="flex space-x-4 border-b pb-2">
          <Link
            to="generalStadistics"
            className={`px-4 py-2 ${
              isGeneralActive
                ? "border-b-2 border-black text-black font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            General
          </Link>
          <Link
            to="occupancy"
            className={`px-4 py-2 ${
              isOccupancyActive
                ? "border-b-2 border-black text-black font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ocupación
          </Link>
          <Link
            to="documentationStadistics"
            className={`px-4 py-2 ${
              isDocumentationActive
                ? "border-b-2 border-black text-black font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Documentación
          </Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
}