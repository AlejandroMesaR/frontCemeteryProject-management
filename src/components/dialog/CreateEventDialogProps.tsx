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
import { useState } from "react";
import { EventoCuerpo } from "@/models";
import { createEvent } from "@/services/managementService";
import Swal from "sweetalert2";

interface CreateEventDialogProps {
  idCadaver: string;
  trigger: React.ReactNode;
  onCreate: (newEvent: EventoCuerpo) => void;
}

export default function CreateEventDialog({ idCadaver, trigger, onCreate }: CreateEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState<Omit<EventoCuerpo, "id">>({
    idCadaver,
    fechaEvento: "",
    tipoEvento: "",
    resumenEvento: "",
    archivo: "",
  });

  const handleCreate = async () => {
    try {
      setLoading(true);
      const createdEvent = await createEvent(newEvent);
      onCreate(createdEvent);
      setNewEvent({
        idCadaver,
        fechaEvento: "",
        tipoEvento: "",
        resumenEvento: "",
        archivo: "",
      });
      setOpen(false);
      Swal.fire('Éxito', 'Evento creado correctamente.', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Error al crear el evento.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl bg-white shadow-2xl p-5 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Registrar Nuevo Evento
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Complete los detalles del nuevo evento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <label className="text-gray-700">Fecha del Evento</label>
            <Input
              type="datetime-local"
              value={newEvent.fechaEvento}
              onChange={(e) => setNewEvent({ ...newEvent, fechaEvento: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Tipo de Evento</label>
            <Input
              type="text"
              value={newEvent.tipoEvento}
              onChange={(e) => setNewEvent({ ...newEvent, tipoEvento: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-gray-700">Resumen</label>
            <Input
              type="text"
              value={newEvent.resumenEvento}
              onChange={(e) => setNewEvent({ ...newEvent, resumenEvento: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-gray-700">Archivo (URL)</label>
            <Input
              type="text"
              value={newEvent.archivo}
              onChange={(e) => setNewEvent({ ...newEvent, archivo: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className="bg-blue-700 text-white hover:bg-blue-500"
            onClick={handleCreate}
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}