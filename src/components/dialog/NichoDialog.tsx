// src/components/dialog/NichoDialog.tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getNichoById, getCuerpoInhumadoByNicho,releaseNicho,actualizarEstadoNicho } from "@/services/managementService";
import { Nicho } from "@/models/Nicho";
import { CuerpoInhumado } from "../../models/CuerpoInhumado";
import { Button } from "@/components/ui/button";
import { formatDate } from "../../pages/cemetery/functionsCementery";

interface NichoDialogProps {
  codigo: string;
  trigger: React.ReactNode;
  onAssigned: (message:string) => void; 
}

export default function NichoDialog({ codigo, trigger, onAssigned }: NichoDialogProps) {
  const [nicho, setNicho] = useState<Nicho | null>(null);
  const [cuerpo, setCuerpo] = useState<CuerpoInhumado | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [releasing, setReleasing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const nichoData = await getNichoById(codigo);
      setNicho(nichoData);
      let cuerpoData: CuerpoInhumado | null = null;

      if (nichoData.estado === "OCUPADO") {
        try {
          cuerpoData = await getCuerpoInhumadoByNicho(codigo);
        } catch {
          cuerpoData = null;
        }
      }
      // Recalcular estado respetando MANTENIMIENTO
      const estado =
        nichoData.estado === "MANTENIMIENTO"
          ? "MANTENIMIENTO"
          : cuerpoData
          ? "OCUPADO"
          : "DISPONIBLE";

      setNicho({ ...nichoData, estado });
      setCuerpo(cuerpoData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const updateStateNicho = async (nuevoEstado: string, nicho:Nicho) => {
    if (!nicho) return;
    setLoading(true);
    try {
      await actualizarEstadoNicho(nicho.codigo, nuevoEstado);
      const updated = await getNichoById(nicho.codigo);
      setNicho({ ...updated, estado: nuevoEstado });
      await onAssigned("Se actualizó correctamente el estado del nicho.");
    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("No se pudo actualizar el estado del nicho");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [codigo]);

  const handleRelease = async () => {
    if (!nicho) return;
    setReleasing(true);
    try {
      await releaseNicho(nicho.codigo);
      const updated = await getNichoById(nicho.codigo);
      setNicho({ ...updated, estado: updated.estado }); 
      setCuerpo(null);
      await onAssigned("Se liberó correctamente el nicho.");
    } catch (err) {
      console.error("Error liberando nicho:", err);
      alert("No se pudo liberar el nicho");
    } finally {
      setReleasing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-2xl rounded-2xl bg-white shadow-2xl p-5 space-y-4">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            {/* Icono temático */}
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Información del Nicho
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-500">
            Detalles del nicho y su ocupante, si aplica.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && nicho && (
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="font-semibold">Código:</span> {nicho.codigo}
            </div>
            <div>
              <span className="font-semibold">Ubicación:</span> {nicho.ubicacion}
            </div>
            <div>
              <span className="font-semibold">Estado:</span>{" "}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  nicho.estado === "OCUPADO"
                    ? "bg-red-100 text-red-800"
                    : nicho.estado === "DISPONIBLE"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {nicho.estado}
              </span>
            </div>
          </div>
        )}

        {!loading && cuerpo && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 text-gray-700">
            <h4 className="text-lg font-semibold text-gray-800">Información del Ocupante</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Nombre:</span>{" "}
                {cuerpo.nombre} {cuerpo.apellido}
              </div>
              <div>
                <span className="font-medium">Documento:</span>{" "}
                {cuerpo.documentoIdentidad}
              </div>
              <div>
                <span className="font-medium">Nacimiento:</span>{" "}
                {formatDate(cuerpo.fechaNacimiento)}
              </div>
              <div>
                <span className="font-medium">Defunción:</span>{" "}
                {formatDate(cuerpo.fechaDefuncion)}
              </div>
              <div>
                <span className="font-medium">Causa de muerte:</span>{" "}
                {cuerpo.causaMuerte}
              </div>
              <div>
                <span className="font-medium">Protocolo:</span>{" "}
                {cuerpo.numeroProtocoloNecropsia}
              </div>
              <div>
                <span className="font-medium">Inhumación:</span>{" "}
                {formatDate(cuerpo.fechaInhumacion)}
              </div>
              <div>
                <span className="font-medium">Estado:</span> {cuerpo.estado}
              </div>
            </div>
            {cuerpo.observaciones && (
              <div className="mt-4 text-sm text-gray-600 italic">
                {cuerpo.observaciones}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-4 mt-6">
          {nicho?.estado === "OCUPADO" && cuerpo && (
            <>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRelease}
                disabled={releasing}
              >
                {releasing ? "Liberando…" : "Liberar Nicho"}
              </Button>

              <Button
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.alert('Funcionalidad en desarrollo')}
              >
                Ver detalles completos
              </Button>
            </>
          )}
          {nicho?.estado === "DISPONIBLE" && (
            <Button
              variant="secondary"
              className="bg-yellow-500 hover:bg-yellow-300 hover:text-amber-800 text-white"
              onClick={() => updateStateNicho("MANTENIMIENTO",nicho)}
            >
              {releasing ? "Actualizando el estado..." : "Realizar mantenimiento"}
            </Button>
          )}
          {nicho?.estado === "MANTENIMIENTO" && (
            <Button
              variant="secondary"
              className="bg-green-600 hover:bg-green-300 hover:text-green-900 text-white"
              onClick={() => updateStateNicho("DISPONIBLE",nicho)}
            >
              {releasing ? "Actualizando el estado..." : "Terminar mantenimiento"}
            </Button>
          )}   
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
