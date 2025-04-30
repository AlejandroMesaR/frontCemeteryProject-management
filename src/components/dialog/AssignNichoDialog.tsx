// src/components/dialog/AssignNichoDialog.tsx
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
import { useState, FormEvent, useEffect } from "react";
import Button from "../../components/utilsComponents/Button";
import { createNichoCuerpo } from "@/services/managementService";
import { AssignNichoDialogProps,Nicho,CuerpoInhumado } from "@/models";
import { getAvailableNichos, getUnassignedBodies } from "@/services/managementService";


export default function AssignNichoDialog({
  trigger,
  onAssigned 
}: AssignNichoDialogProps) {
  const [open, setOpen] = useState(false);
  const [nichos, setNichos] = useState<Nicho[]>([]);
  const [cuerpos, setCuerpos] = useState<CuerpoInhumado[]>([]);
  const [selectedNicho, setSelectedNicho] = useState<string>("");
  const [selectedCuerpo, setSelectedCuerpo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createNichoCuerpo({
        codigoNicho: selectedNicho,
        idCadaver: selectedCuerpo
      });
      await onAssigned("Se ha asignado el nicho correctamente.");
      setOpen(false);
    } catch (err) {
      console.error("Error asignando nicho:", err);
      setError("No se pudo asignar el nicho. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [nichosDisponibles, cuerposNoAsignados] = await Promise.all([
        getAvailableNichos(),
        getUnassignedBodies()
      ]);

      setNichos(nichosDisponibles);
      setCuerpos(cuerposNoAsignados);
      setSelectedNicho(nichosDisponibles[0]?.codigo || "");
      setSelectedCuerpo(cuerposNoAsignados[0]?.idCadaver || "");

    } catch (err) {
      console.error("Error cargando datos disponibles:", err);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return (
    <Dialog open={open}
      onOpenChange={ async (isOpen)  => {
        setOpen(isOpen);
        if (isOpen) {
          await loadOptions();
        }
      }}
    >
      <DialogTrigger asChild>
          {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Asignar Nuevo Nicho
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Selecciona el nicho y el cuerpo inhumado que deseas vincular.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Selector de Nicho */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nicho
            </label>
            <select
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedNicho}
              onChange={(e) => setSelectedNicho(e.target.value)}
              required
            >
              {nichos.map((n) => (
                <option key={n.codigo} value={n.codigo}>
                  {n.ubicacion} — {n.codigo}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Cuerpo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cuerpo Inhumado
            </label>
            <select
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCuerpo}
              onChange={(e) => setSelectedCuerpo(e.target.value)}
              required
            >
              {cuerpos.map((c) => (
                <option key={c.idCadaver} value={c.idCadaver}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <DialogFooter className="flex justify-end space-x-3 mt-6">
            <DialogClose asChild>
              <Button className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
              {loading ? "Asignando..." : "Asignar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
