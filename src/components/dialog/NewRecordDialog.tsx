import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useToast } from '../toast/useToast';
import Button from '../utilsComponents/Button';

function NewRecordDialog() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Registro creado con éxito');
    setOpen(false);
    setFullName('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="bg-primary">Nuevo Registro</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">Crear Nuevo Registro</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Ingresa la información necesaria para dar de alta un nuevo registro.
          </Dialog.Description>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button className="bg-gray-300 text-dark">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default NewRecordDialog;
