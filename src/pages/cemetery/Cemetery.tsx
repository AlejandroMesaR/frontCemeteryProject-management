import { useEffect, useState } from "react";
import Button from "../../components/utilsComponents/Button";
import Card from "../../components/card/Card";
import { getAllNichos,getAllBodies } from "../../services/managementService"
import { Nicho,CuerpoInhumado } from "../../models";
import { getNicheStyle, getNicheNumber,sortNichosByNumber} from "./functionsCementery"
import NichoDialog from "../../components/dialog/NichoDialog";
import AssignNichoDialog from "../../components/dialog/AssignNichoDialog";

const CemeteryMap = () => {
  const [nichos, setNichos] = useState<Nicho[]>([]);
  const [cuerpos, setCuerpos] = useState<CuerpoInhumado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      const dataCuerpos = await getAllBodies();
      setCuerpos(dataCuerpos);
      setNichos(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching nichos:", err);
      setError("Error al cargar los datos de nichos o los cuerpos. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNichos();
  }, []);


  return (
    <div className="p-8 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900">Gestión de nichos</h1>
      <p className="text-gray-600">Representación visual de los nichos del santuario y su estado actual</p>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        <button className="px-4 py-2 border-b-2 border-black font-semibold">Gestión de nichos</button>
        <button className="px-4 py-2 text-gray-500 hover:text-black transition-colors">Análisis de Datos</button>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        {/* Cemetery Grid */}
        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Mapa de Nichos</h2>
          
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 border p-3 rounded-xl bg-white shadow-md">
              {sortNichosByNumber(nichos).map((nicho) => (
                <NichoDialog
                  key={nicho.codigo}
                  codigo={nicho.codigo}
                  onAssigned={fetchNichos}
                  trigger={
                    <button
                      className={`h-12 w-full flex items-center justify-center rounded-lg text-sm font-medium border shadow-sm transition-all ${getNicheStyle(nicho.estado)}`}
                      title={nicho.ubicacion}
                      
                    >
                      {getNicheNumber(nicho.ubicacion)}
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Card className="w-full md:w-72 p-6 space-y-6 bg-white shadow-lg rounded-xl">
          <h3 className="font-bold text-lg text-gray-800">Leyenda y estadísticas</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><span className="w-5 h-5 bg-red-300 rounded" />Ocupado</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 border border-dashed border-gray-400 bg-gray-50 rounded" />Disponible</div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 bg-yellow-300 rounded" />En Mantenimiento</div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Total Nichos: {totalNichos}</p>
            <p>Ocupados: {ocupados} ({porcentajeOcupados}%)</p>
            <p>Disponibles: {disponibles} ({porcentajeDisponibles}%)</p>
            <p>En Mantenimiento: {enMantenimiento} ({porcentajeMantenimiento}%)</p>
          </div>
          <AssignNichoDialog
            trigger={<Button className="w-full bg-gray-600 hover:bg-gray-800 text-white font-semibold rounded-lg">Asignar nuevo Nicho</Button>}
            nichos={nichos}
            cuerpos={cuerpos}
            onAssigned={fetchNichos}
          />
        </Card>
      </div>
    </div>
  );
};

export default CemeteryMap;