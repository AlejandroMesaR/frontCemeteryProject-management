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
import { EventoCuerpo } from "@/models/EventoCuerpo";

interface EventDetailsDialogProps {
  event: EventoCuerpo;
  trigger: React.ReactNode;
}

export default function EventDetailsDialog({ event, trigger }: EventDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl bg-white shadow-2xl p-5 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Detalles del Evento
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Información detallada del evento seleccionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-gray-700">
          <div><span className="font-semibold">ID:</span> {event.id}</div>
          <div><span className="font-semibold">Fecha:</span> {event.fechaEvento}</div>
          <div><span className="font-semibold">Tipo:</span> {event.tipoEvento}</div>
          <div><span className="font-semibold">Resumen:</span> {event.resumenEvento}</div>
          <div>
            <span className="font-semibold">Archivo:</span>{" "}
            {event.archivo ? (
              <a href={event.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Ver archivo
              </a>
            ) : (
              "Sin archivo"
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-4 mt-6">
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