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
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/utilsComponents/Input";
import { Button } from "@/components/ui/button";
import { createBody } from "@/services/managementService";
import { CuerpoInhumado } from "@/models/CuerpoInhumado";

type ToastType = 'success' | 'error';

interface CreateBodyDialogProps {
  onCreate: (message: string, type: ToastType) => void;
}

export default function CreateBodyDialog({ onCreate }: CreateBodyDialogProps) {
  const [formData, setFormData] = useState<CuerpoInhumado>({
    idCadaver: "",
    nombre: "",
    apellido: "",
    documentoIdentidad: "",
    numeroProtocoloNecropsia: "",
    causaMuerte: "",
    fechaNacimiento: new Date(),
    fechaDefuncion: new Date(),
    fechaIngreso: new Date(),
    fechaInhumacion: new Date(),
    fechaExhumacion: new Date(),
    funcionarioReceptor: "",
    cargoFuncionario: "",
    autoridadRemitente: "",
    cargoAutoridadRemitente: "",
    autoridadExhumacion: "",
    cargoAutoridadExhumacion: "",
    estado: "",
    observaciones: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formatDateForInput = (date: string | Date, type: 'date' | 'datetime-local'): string => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return ""; // Manejar fechas inválidas
    if (type === 'date') {
      return dateObj.toISOString().slice(0, 10); // Formato YYYY-MM-DD para input type="date"
    }
    return dateObj.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:mm para input type="datetime-local"
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["fechaNacimiento", "fechaDefuncion", "fechaInhumacion", "fechaExhumacion", "fechaIngreso"].includes(name)
        ? (value ? new Date(value) : new Date())
        : value,
    }));
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const bodyData: CuerpoInhumado = {
        ...formData,
        fechaNacimiento: new Date(formData.fechaNacimiento),
        fechaDefuncion: new Date(formData.fechaDefuncion),
        fechaIngreso: new Date(formData.fechaIngreso),
        fechaInhumacion: new Date(formData.fechaInhumacion),
        fechaExhumacion: new Date(formData.fechaExhumacion),
      };
      await createBody(bodyData);
      onCreate(`Cuerpo ${formData.nombre} ${formData.apellido} creado correctamente`, 'success');
      setFormData({
        idCadaver: "",
        nombre: "",
        apellido: "",
        documentoIdentidad: "",
        numeroProtocoloNecropsia: "",
        causaMuerte: "",
        fechaNacimiento: new Date(),
        fechaDefuncion: new Date(),
        fechaIngreso: new Date(),
        fechaInhumacion: new Date(),
        fechaExhumacion: new Date(),
        funcionarioReceptor: "",
        cargoFuncionario: "",
        autoridadRemitente: "",
        cargoAutoridadRemitente: "",
        autoridadExhumacion: "",
        cargoAutoridadExhumacion: "",
        estado: "",
        observaciones: "",
      });
      setOpen(false);
    } catch (error: any) {
      onCreate(error.message || "Error al crear el cuerpo", 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-400 transition" size="icon">
          <FaPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl p-5 flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-800">Crear Nuevo Cuerpo</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Ingresa los datos del nuevo cuerpo y guarda la información.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col">
              <label className="text-gray-700">Nombre</label>
              <Input name="nombre" value={formData.nombre} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Apellido</label>
              <Input name="apellido" value={formData.apellido} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Documento de Identidad</label>
              <Input name="documentoIdentidad" value={formData.documentoIdentidad} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Protocolo de Necropsia</label>
              <Input name="numeroProtocoloNecropsia" value={formData.numeroProtocoloNecropsia} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Causa de Muerte</label>
              <Input name="causaMuerte" value={formData.causaMuerte} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Fecha de Nacimiento</label>
              <Input
                type="date"
                name="fechaNacimiento"
                value={formatDateForInput(formData.fechaNacimiento, 'date')}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Fecha de Defunción</label>
              <Input
                type="date"
                name="fechaDefuncion"
                value={formatDateForInput(formData.fechaDefuncion, 'date')}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Fecha de Ingreso</label>
              <Input
                type="datetime-local"
                name="fechaIngreso"
                value={formatDateForInput(formData.fechaIngreso, 'datetime-local')}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Fecha de Inhumación</label>
              <Input
                type="date"
                name="fechaInhumacion"
                value={formatDateForInput(formData.fechaInhumacion, 'date')}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Fecha de Exhumación</label>
              <Input
                type="date"
                name="fechaExhumacion"
                value={formatDateForInput(formData.fechaExhumacion, 'date')}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Funcionario Receptor</label>
              <Input name="funcionarioReceptor" value={formData.funcionarioReceptor} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Cargo del Funcionario</label>
              <Input name="cargoFuncionario" value={formData.cargoFuncionario} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Autoridad Remitente</label>
              <Input name="autoridadRemitente" value={formData.autoridadRemitente} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Cargo de la Autoridad Remitente</label>
              <Input name="cargoAutoridadRemitente" value={formData.cargoAutoridadRemitente} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Autoridad de Exhumación</label>
              <Input name="autoridadExhumacion" value={formData.autoridadExhumacion} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Cargo de la Autoridad de Exhumación</label>
              <Input name="cargoAutoridadExhumacion" value={formData.cargoAutoridadExhumacion} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Estado</label>
              <Input name="estado" value={formData.estado} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-gray-700">Observaciones</label>
              <Input name="observaciones" value={formData.observaciones} onChange={handleChange} className="border p-2 rounded" />
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