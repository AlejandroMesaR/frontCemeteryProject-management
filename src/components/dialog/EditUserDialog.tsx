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

import { useState } from "react";
import { Input } from "../utilsComponents/Input";
import  {Button } from "../ui/button";
import { updateUser } from "@/services/authService";
import { User } from "@/models/User";
import ButtonP from "../utilsComponents/Button";

type ToastType = 'success' | 'error';

interface EditUserDialogProps {
  user: User;
  onComplete: (message: string, type: ToastType) => void;
}

export default function EditUserDialog({ user, onComplete }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    identificationNumber: user.identificationNumber,
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateUser(user.id, formData);
      onComplete(`Usuario ${formData.username} actualizado correctamente`, 'success');
    } catch (error) {
      onComplete("Error al actualizar usuario", 'error');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonP className="bg-green-800 p-0">Editar</ButtonP>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <Input name="identificationNumber" placeholder="Cédula" value={formData.identificationNumber} onChange={handleChange} />
          <Input name="password" placeholder="Nueva contraseña (opcional)" type="password" value={formData.password} onChange={handleChange} />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="bg-green-800" onClick={handleUpdate}>
              Guardar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
