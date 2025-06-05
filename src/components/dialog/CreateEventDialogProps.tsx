import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/utilsComponents/Input";
import { Button } from "@/components/ui/button";
import { createEventFile } from "../../services/managementService";

interface CreateEventDialogProps {
  idCadaver: string;
  trigger: React.ReactNode;
  onCreate: (message: string, type: string) => void;
}

export default function CreateEventDialog({ idCadaver, trigger, onCreate }: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    idCadaver: idCadaver,
    fechaEvento: "",
    tipoEvento: "",
    resumenEvento: "",
    archivo: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    console.log("Input changed:", name, value, files);
    if (name === "archivo" && files) {
      setFormData((prev) => ({ ...prev, archivo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 16);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      // Basic validation
      if (!formData.fechaEvento || !formData.tipoEvento || !formData.resumenEvento) {
        throw new Error("Por favor, completa todos los campos obligatorios.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("idCadaver", formData.idCadaver);
      formDataToSend.append("fechaEvento", new Date(formData.fechaEvento).toISOString().split("T")[0]); // Format as YYYY-MM-DD
      formDataToSend.append("tipoEvento", formData.tipoEvento);
      formDataToSend.append("resumenEvento", formData.resumenEvento);
      if (formData.archivo) {
        formDataToSend.append("archivo", formData.archivo);
      } else {
        throw new Error("El archivo es obligatorio."); // Match backend validation
      }

      const response = await createEventFile(formDataToSend);
      console.log("Evento creado:", response);
      onCreate(`Evento ${formData.tipoEvento} se ha creado correctamente`, "success");
      setFormData({
        idCadaver: idCadaver,
        fechaEvento: "",
        tipoEvento: "",
        resumenEvento: "",
        archivo: null,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating event:", error);
      // Check if the error is from the backend response
      onCreate(`Error al crear el evento: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl p-5 flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">Registrar Nuevo Evento</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Ingresa los detalles del evento y sube un archivo PDF (obligatorio).
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <label className="text-gray-700">Fecha del Evento *</label>
              <Input
                type="datetime-local"
                name="fechaEvento"
                value={formatDateForInput(formData.fechaEvento)}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Tipo de Evento *</label>
              <Input
                name="tipoEvento"
                value={formData.tipoEvento}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-gray-700">Resumen del Evento *</label>
              <Input
                name="resumenEvento"
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
        </div>

        <DialogFooter className="shrink-0 flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-gray-300 text-gray-700">Cancelar</Button>
          </DialogClose>
          <Button className="bg-green-800 hover:bg-green-900" onClick={handleCreate}>
            {loading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}