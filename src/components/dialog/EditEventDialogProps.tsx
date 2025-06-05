import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/utilsComponents/Input";
import { useState, useEffect } from "react";
import { EventoCuerpo } from "@/models";
import { updateEvent } from "@/services/managementService";
import { FaEdit } from "react-icons/fa";

interface EditEventDialogProps {
  event: EventoCuerpo;
  onUpdate: (message: string, type: string) => void;
}

export default function EditEventDialog({ event, onUpdate }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: event.id,
    idCadaver: event.idCadaver,
    fechaEvento: event.fechaEvento,
    tipoEvento: event.tipoEvento,
    resumenEvento: event.resumenEvento,
    archivo: null as File | null,
  });

  // Función para formatear la fecha para el input datetime-local
  useEffect(() => {
    // Si fechaEvento existe, aseguramos que tenga el formato correcto para datetime-local
    if (event.fechaEvento) {
      try {
        // Comprobamos si el formato ya incluye la hora
        if (event.fechaEvento.includes("T")) {
          // Ya tiene el formato correcto YYYY-MM-DDThh:mm
          setFormData(prev => ({
            ...prev,
            fechaEvento: event.fechaEvento.slice(0, 16) // Aseguramos que solo tenga hasta los minutos
          }));
        } else {
          // Formato solo fecha (YYYY-MM-DD) - añadimos la hora (12:00 por defecto)
          const dateOnly = event.fechaEvento.split(" ")[0]; // En caso de que tenga espacio
          const formattedDate = `${dateOnly}T12:00`;
          setFormData(prev => ({
            ...prev,
            fechaEvento: formattedDate
          }));
        }
      } catch (error) {
        console.error("Error al formatear la fecha:", error);
        // Valor por defecto en caso de error
        const today = new Date();
        const formattedToday = today.toISOString().slice(0, 16);
        setFormData(prev => ({
          ...prev,
          fechaEvento: formattedToday
        }));
      }
    }
  }, [event.fechaEvento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    console.log("Input changed:", name, value, files);
    if (name === "archivo" && files) {
      setFormData((prev) => ({ ...prev, archivo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
      try {
        await updateEvent(event.id, formData);
        onUpdate(`Evento ${formData.tipoEvento} con ID: ${formData.id} actualizado correctamente`, 'success');
      } catch (error) {
        onUpdate("Error al actualizar evento", 'error');
      } finally {
        setLoading(false);
        setOpen(false);
      }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-600 hover:bg-yellow-400 transition">
          <FaEdit />
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl rounded-2xl bg-white shadow-2xl p-5 space-y-4"
        // Aseguramos que el diálogo esté correctamente configurado para accesibilidad
        aria-hidden={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Editar Evento
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Modifique los detalles del evento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <label className="text-gray-700" htmlFor="fechaEvento">Fecha del Evento</label>
            <Input
              id="fechaEvento"
              name="fechaEvento"
              type="datetime-local"
              value={formData.fechaEvento}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700" htmlFor="tipoEvento">Tipo de Evento</label>
            <Input
              id="tipoEvento"
              name="tipoEvento"
              type="text"
              value={formData.tipoEvento}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-gray-700" htmlFor="resumenEvento">Resumen</label>
            <Input
              id="resumenEvento"
              name="resumenEvento"
              type="text"
              value={formData.resumenEvento}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col col-span-2">
              <label className="text-gray-700">Archivo PDF *</label>
              <Input
                type="file"
                name="archivo"
                accept="application/pdf"
                onChange={handleChange}
                className="border p-2 rounded"
              />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4 mt-6">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700"
              type="button"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className="bg-blue-700 text-white hover:bg-blue-500"
            onClick={handleUpdate}
            disabled={loading}
            type="button"
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}