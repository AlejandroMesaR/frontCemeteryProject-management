import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

function ProfileDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
          aria-label="Menu de Perfil"
        >
          <DotsVerticalIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white shadow-lg rounded p-1"
          sideOffset={5}
        >
          <DropdownMenu.Item className="p-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded">
            Mi Perfil
          </DropdownMenu.Item>
          <DropdownMenu.Item className="p-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded">
            Configuración
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
          <DropdownMenu.Item className="p-2 text-sm text-red-500 cursor-pointer hover:bg-red-100 rounded">
            Cerrar Sesión
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default ProfileDropdown;
