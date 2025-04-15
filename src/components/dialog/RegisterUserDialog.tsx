import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Button from "../utilsComponents/Button";
import { Input } from "../utilsComponents/Input";
import { Label } from "../utilsComponents/Label";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from '../../services/authService';

type ToastType = 'success' | 'error';

interface AddUserDialogProps {
  onComplete: (message: string, type: ToastType) => void;
}


const AddUserDialog = ({onComplete}: AddUserDialogProps) => {
  const [open, setOpen] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', identificationNumber: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    try {
      await registerUser(form);
      setOpen(false);
      onComplete(`Usuario ${form.username} registrado correctamente`, 'success');
    } catch (err: any) {
      setOpen(false);
      onComplete("Error al registrar usuario", 'error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="bg-black text-white">Agregar Usuario</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Registrar Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nombre de Usuario</Label>
            <Input type="text" onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Ej: JuanPérez123" />
          </div>
          <div>
            <Label>Correo Electrónico</Label>
            <Input type="email" onChange={e => setForm({ ...form, email: e.target.value })} placeholder="usuario@email.com" />
          </div>
          <div>
            <Label>Cédula</Label>
            <Input type="text" onChange={e => setForm({ ...form, identificationNumber: e.target.value })} placeholder="Ej: 123456789" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full bg-black text-white">Guardar Usuario</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
