import { useState, useEffect} from "react";
import { Input } from "../../components/utilsComponents/Input";
import Card  from "../../components/card/Card";
import Button  from "../../components/utilsComponents/Button"; 
import {Table,TableHeader,TableBody,TableRow,TableHead,TableCell,} from "@/components/ui/table";
import EditUserDialog from "../../components/dialog/EditUserDialog";
import RegsiterUser from "../../components/dialog/RegisterUserDialog";
import { getAllUsers, deleteUser } from "../../services/authService"; 
import { User } from "../../models/User"; 
import { capitalize } from "lodash";
import { useToast } from "../../components/toast/useToast";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const UserManagement = () => {

  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al cargar documentos:', error);
      Swal.fire('Error', `No se pudó cargar la informacion de los usuarios: ${errorMessage}`, 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search, users]);

  const handleDelete = async (id: number, username: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará el usuario de manera permanente al usuario ${username}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded mr-2',
        cancelButton: 'bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded'
      },
      buttonsStyling: false 
    });
  
    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire('Eliminado', `El usuario ${username} ha sido eliminado exitosamente.`, 'success');
        fetchUsers(); // Refresh the list after deletion
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Swal.fire('Error', 'Ocurrió un error al eliminar.', 'error');
      }
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
          <p className="text-gray-500">Administrar usuarios y sus permisos de acceso</p>
        </div>
        <RegsiterUser 
          onComplete={(message,type) => {
            showToast(message,type);
            fetchUsers();
        }}/>
      </div>

      <Input
        placeholder="Buscar usuarios..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-sm rounded-full ${user.role === "ADMIN" ? "bg-black text-white" : "bg-gray-200"}`}>
                  {capitalize(user.role) || "Usuario"}
                </span>
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 text-sm text-gray-500">
                  {user.identificationNumber}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <EditUserDialog
                  user={user}
                  onComplete={(message, type) => {
                    showToast(message,type);
                    fetchUsers();
                  }}
                />
                <Button
                    className="bg-red-600 text-white hover:underline hover:bg-red-400 transition "
                    onClick={() => handleDelete(user.id, user.username)}>Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserManagement;