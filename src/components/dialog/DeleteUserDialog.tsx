import * as Dialog from "@radix-ui/react-dialog";
import Button from "../utilsComponents/Button";
import { deleteUser } from "@/services/authService";
import { User } from "@/models/User";

type ToastType = 'success' | 'error';

interface DeleteUserDialogProps {
  user: User;
  onComplete: (message: string, type: ToastType) => void;
}

export default function DeleteUserDialog({ user, onComplete }: DeleteUserDialogProps) {

  const handleDelete = async () => {
  try {
    await deleteUser(user.id);
    onComplete(`Usuario ${user.username} eliminado correctamente`, 'success');
  } catch (error) {
    onComplete("Error al eliminar usuario", 'error');
  }
};

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="bg-red-800 p-0">Borrar</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed bg-white rounded p-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 shadow">
          <Dialog.Title className="text-xl font-bold mb-4">Eliminar usuario</Dialog.Title>
          <p className="mb-6">¿Estás seguro de que quieres eliminar a <strong>{user.username}</strong>?</p>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button className="bg-gray-400">Cancelar</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button className="bg-red-800" onClick={handleDelete}>
                Eliminar
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
